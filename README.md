# 🍅 Smart Todo & Pomodoro Timer
> **Todo 리스트와 뽀모도로 기법을 결합한 생산성 향상 웹 애플리케이션**


---

## 📌 프로젝트 소개
단순한 일정 관리를 넘어, **뽀모도로(Pomodoro)** 시간 관리 기법을 적용하여 사용자의 실질적인 집중 시간을 측정하고 데이터화하는 웹 서비스입니다. 

- **주요 목표:** 작업별 집중도 분석 및 시각화 피드백 제공

---

## 🛠 기술 스택

### Front-end
- **Framework:** React.js
- **Styling:** Tailwind CSS
- **State Management:** Context API / Redux
- **Library:** Axios, Chart.js

### Back-end
- **Runtime:** Node.js (Express)
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Token)

---

## 📂 프로젝트 구조
```text
.
├── client/          # 프론트엔드 (React)
│    ├── src/        # 소스 코드
│    └── public/     # 정적 파일
├── server/          # 백엔드 (Node.js)
│    ├── models/     # DB 스키마
│    ├── routes/     # API 라우팅
│    └── index.js    # 서버 시작점
└── README.md
