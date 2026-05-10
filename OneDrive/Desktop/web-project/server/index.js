const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Todo = require('./models/Todo'); // 모델 경로 확인

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어
app.use(cors());
app.use(express.json());

// MongoDB 연결
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB 연결 성공!'))
  .catch(err => console.error('❌ DB 연결 에러:', err));

// --- API 라우트 ---

// 1. 모든 할 일 가져오기 (시간순 정렬)
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. 할 일 추가 (시간 데이터 저장 핵심!)
app.post('/api/todos', async (req, res) => {
  try {
    const { title, time } = req.body; // 프론트에서 보낸 데이터 추출
    
    if (!title) return res.status(400).json({ message: "제목은 필수입니다." });

    const newTodo = new Todo({ 
      title: title, 
      time: time || "00:00" // 시간이 없으면 기본값 설정
    });

    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(400).json({ message: "저장 실패", error: err.message });
  }
});

// 3. 할 일 수정 (체크박스 및 내용 수정)
app.patch('/api/todos/:id', async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body, // 수정할 내용 전체(isCompleted 등) 반영
      { returnDocument: 'after', runValidators: true }
    );
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: "수정 실패", error: err.message });
  }
});

// 4. 할 일 삭제
app.delete('/api/todos/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "삭제 성공" });
  } catch (err) {
    res.status(500).json({ message: "삭제 실패" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});