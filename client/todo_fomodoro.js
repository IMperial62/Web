const timeInput = document.getElementById("timeInput");
const scheduleInput = document.getElementById("scheduleInput");
const addScheduleBtn = document.getElementById("addScheduleBtn");
const scheduleList = document.getElementById("scheduleList");
const selectedTask = document.getElementById("selectedTask");
const timer = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const timerMode = document.getElementById("timerMode");
let timeLeft = 1500; // 집중 25분
let timerInterval;
let isBreakTime = false; // false = 집중, true = 휴식

let schedules = [];

addScheduleBtn.addEventListener("click", addSchedule);

function addSchedule() {
  const time = timeInput.value;
  const content = scheduleInput.value.trim();

  if (time === "" || content === "") {
    alert("시간과 일정 내용을 모두 입력하세요.");
    return;
  }

  const schedule = {
    time: time,
    content: content,
    completed: false
  };

  schedules.push(schedule);

  saveSchedules();
  renderSchedules();

  timeInput.value = "";
  scheduleInput.value = "";
}
function saveSchedules() {
  localStorage.setItem("schedules", JSON.stringify(schedules));
}

function renderSchedules() {
  scheduleList.innerHTML = "";

  schedules.forEach(function (schedule, index) {
    const li = document.createElement("li");

    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.checked = schedule.completed;

    const timeSpan = document.createElement("span");
    timeSpan.textContent = schedule.time;

    const contentSpan = document.createElement("span");
    contentSpan.textContent = schedule.content;

    if (schedule.completed) {
      timeSpan.style.textDecoration = "line-through";
      timeSpan.style.color = "gray";
      contentSpan.style.textDecoration = "line-through";
      contentSpan.style.color = "gray";
    }

    checkBox.addEventListener("change", function () {
      schedule.completed = checkBox.checked;

      saveSchedules();
      renderSchedules();
    });

    const selectBtn = document.createElement("button");
    selectBtn.textContent = "선택";

    selectBtn.addEventListener("click", function () {
      selectedTask.textContent = `${schedule.time} ${schedule.content}`;
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "삭제";

    deleteBtn.addEventListener("click", function () {
      schedules.splice(index, 1);

      saveSchedules();
      renderSchedules();

      if (selectedTask.textContent === `${schedule.time} ${schedule.content}`) {
        selectedTask.textContent = "선택된 일정 없음";
      }
    });

    const leftDiv = document.createElement("div");
    leftDiv.className = "schedule-left";

    leftDiv.appendChild(checkBox);
    leftDiv.appendChild(document.createTextNode(" "));
    leftDiv.appendChild(timeSpan);
    leftDiv.appendChild(document.createTextNode(" "));
    leftDiv.appendChild(contentSpan);

    const rightDiv = document.createElement("div");
    rightDiv.className = "schedule-right";

    rightDiv.appendChild(selectBtn);
    rightDiv.appendChild(document.createTextNode(" "));
    rightDiv.appendChild(deleteBtn);

    li.appendChild(leftDiv);
    li.appendChild(rightDiv);

    scheduleList.appendChild(li);
  });
}
startBtn.addEventListener("click", startTimer);

function startTimer() {

  if (selectedTask.textContent === "선택된 일정 없음") {
    alert("일정을 먼저 선택하세요.");
    return;
  }

  if (timerInterval) return;

  timerInterval = setInterval(function () {

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;

      if (isBreakTime === false) {
        isBreakTime = true;
        timeLeft = 300;

        timer.textContent = "05:00";
        timerMode.textContent = "휴식";
        document.querySelector(".circle-timer").classList.add("break-mode");

        startTimer();
      } else {
        isBreakTime = false;
        timeLeft = 1500;

        timer.textContent = "25:00";
        timerMode.textContent = "집중!";
        document.querySelector(".circle-timer").classList.remove("break-mode");

        startTimer();
      }

      return;
    }

    timeLeft--;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timer.textContent =
      `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  }, 1000);
}

pauseBtn.addEventListener("click", pauseTimer);

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}
resetBtn.addEventListener("click", resetTimer);

function resetTimer() {

  clearInterval(timerInterval);
  timerInterval = null;

  isBreakTime = false;
  timeLeft = 1500;

  timer.textContent = "25:00";
  timerMode.textContent = "집중!";
  document.querySelector(".circle-timer").classList.remove("break-mode");
}
const savedData = localStorage.getItem("schedules");

if (savedData) {
  schedules = JSON.parse(savedData);
  renderSchedules();
}

const quotes = [
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

const quote = document.getElementById("quote");

const randomIndex = Math.floor(Math.random() * quotes.length);

quote.textContent = quotes[randomIndex];