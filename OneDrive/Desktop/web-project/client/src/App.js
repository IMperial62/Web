import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

// 서버 주소 설정
const API_URL = 'http://localhost:5000/api/todos';

// 명언 데이터
const QUOTES = [
  "\"작은 진전도 진전이다.\" - 마리 포를레오",
  "\"꾸준함은 재능을 이긴다.\" - 앤절라 더크워스",
  "\"시작이 반이다.\" - 아리스토텔레스",
  "\"성공은 매일 반복한 작은 노력의 합이다.\" - 로버트 콜리어",
  "\"천천히 가도 멈추지 않으면 괜찮다.\" - 공자",
  "\"오늘 걷지 않으면 내일은 뛰어야 한다.\" - 카를로스 푸엔테스",
  "\"행동은 모든 성공의 기초다.\" - 파블로 피카소",
  "\"미래는 오늘 무엇을 하는가에 달려 있다.\" - 마하트마 간디",
  "\"완벽보다 중요한 건 지속이다.\" - 제임스 클리어",
  "\"포기하지 않는 사람만이 결국 도달한다.\" - 나폴레옹 힐",
  "\"위대한 일은 한 번에 이루어지지 않는다.\" - 빈센트 반 고흐"
];

function App() {
  // --- 상태 관리 ---
  const [todos, setTodos] = useState([]);
  const [timeInput, setTimeInput] = useState('');
  const [contentInput, setContentInput] = useState('');
  const [selectedTask, setSelectedTask] = useState("선택된 일정 없음");
  const [quote, setQuote] = useState("");

  // 타이머 관련 상태
  const [timeLeft, setTimeLeft] = useState(1500); // 25분 (초 단위)
  const [isActive, setIsActive] = useState(false);
  const [isBreakTime, setIsBreakTime] = useState(false);

  // --- 함수 정의 (useCallback으로 최적화) ---

  // 1. 데이터 불러오기
  const fetchTodos = useCallback(async () => {
    try {
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch (e) {
      console.error("서버 연결 실패:", e);
    }
  }, []);

  // 2. 초기 로드 (데이터 + 명언)
  useEffect(() => {
    fetchTodos();
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, [fetchTodos]);

  // 3. 타이머 핵심 로직
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      setIsActive(false);
      if (!isBreakTime) {
        alert("집중 완료! 휴식 시간입니다.");
        setIsBreakTime(true);
        setTimeLeft(300); // 5분 휴식
      } else {
        alert("휴식 완료! 다시 집중해볼까요?");
        setIsBreakTime(false);
        setTimeLeft(1500);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreakTime]);

  // 4. 할 일 추가 (undefined 방지 로직 포함)
  const addSchedule = async () => {
    if (!timeInput || !contentInput.trim()) {
      alert("시간과 일정 내용을 모두 입력하세요.");
      return;
    }
    try {
      const newTodo = { 
        time: timeInput, 
        title: contentInput.trim(), // 서버 스키마에 따라 title 또는 content 확인 필요
        isCompleted: false 
      };
      const res = await axios.post(API_URL, newTodo);
      setTodos(prev => [...prev, res.data]);
      setTimeInput('');
      setContentInput('');
    } catch (e) {
      alert("추가 실패: 서버를 확인하세요.");
    }
  };

  // 5. 할 일 삭제
  const deleteTodo = async (id, taskStr) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(prev => prev.filter(t => t._id !== id));
      if (selectedTask === taskStr) setSelectedTask("선택된 일정 없음");
    } catch (e) {
      console.error("삭제 실패", e);
    }
  };

  // 6. 체크박스 상태 변경 (클릭 안됨 문제 해결)
  const toggleComplete = async (id, currentStatus) => {
    try {
      const res = await axios.patch(`${API_URL}/${id}`, { isCompleted: !currentStatus });
      setTodos(prev => prev.map(t => t._id === id ? res.data : t));
    } catch (e) {
      console.error("상태 변경 실패", e);
    }
  };

  // 7. 시간 포맷팅 (00:00)
  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div className="app">
      {/* 왼쪽 ToDo 패널 */}
      <section className="todo-panel">
        <h2>ToDo List</h2>
        <ul id="scheduleList">
          {todos.length === 0 && <p style={{color: '#999', fontSize: '14px'}}>등록된 일정이 없습니다.</p>}
          {todos.map(todo => {
            // undefined 방지 처리
            const displayTime = todo.time || "--:--";
            const displayTitle = todo.title || "내용 없음";
            const taskStr = `${displayTime} ${displayTitle}`;

            return (
              <li key={todo._id}>
                <div className="schedule-left">
                  <input 
                    type="checkbox" 
                    checked={!!todo.isCompleted} 
                    onChange={() => toggleComplete(todo._id, todo.isCompleted)} 
                  />
                  <span style={{ 
                    textDecoration: todo.isCompleted ? 'line-through' : 'none',
                    color: todo.isCompleted ? 'gray' : '#333',
                    marginLeft: '10px',
                    cursor: 'default'
                  }}>
                    {taskStr}
                  </span>
                </div>
                <div className="schedule-right">
                  <button onClick={() => setSelectedTask(taskStr)}>선택</button>
                  <button onClick={() => deleteTodo(todo._id, taskStr)} style={{backgroundColor: '#ff6b6b', marginLeft: '5px'}}>삭제</button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 오른쪽 메인 패널 */}
      <section className="main-panel">
        <div className="timer-area">
          <div className="timer-wrap">
            <p id="timerMode" style={{ color: isBreakTime ? '#2ecc71' : '#5b6cff' }}>
              {isBreakTime ? "휴식!" : "집중!"}
            </p>
            <div className={`circle-timer ${isBreakTime ? 'break-mode' : ''}`}>
              <span id="timer">{formatTime(timeLeft)}</span>
            </div>
          </div>

          <div className="current-task">
            <h3>현재 작업</h3>
            <p id="selectedTask">{selectedTask}</p>
            <div className="timer-controls">
              <button id="startBtn" onClick={() => {
                if(selectedTask === "선택된 일정 없음") return alert("목록에서 [선택] 버튼을 먼저 눌러주세요!");
                setIsActive(true);
              }}>START</button>
              <button id="pauseBtn" onClick={() => setIsActive(false)} style={{margin: '0 5px'}}>STOP</button>
              <button id="resetBtn" onClick={() => { setIsActive(false); setTimeLeft(1500); setIsBreakTime(false); }}>RESET</button>
            </div>
          </div>
        </div>

        {/* 일정 입력 카드 */}
        <div className="schedule-box">
          <h3>일정 관리</h3>
          <div className="schedule-input">
            <input 
              type="time" 
              id="timeInput" 
              value={timeInput} 
              onChange={e => setTimeInput(e.target.value)} 
            />
            <input 
              type="text" 
              id="scheduleInput" 
              placeholder="일정 내용을 입력하세요" 
              value={contentInput} 
              onChange={e => setContentInput(e.target.value)} 
            />
            <button id="addScheduleBtn" onClick={addSchedule}>추가</button>
          </div>
        </div>

        {/* 명언 박스 */}
        <div className="quote-box">
          <p id="quote">{quote}</p>
        </div>
      </section>
    </div>
  );
}

export default App;