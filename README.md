# AI-Driven Emotion-Adaptive Gaming UI

A real-time AI-powered web application that detects a user's facial emotions via webcam and dynamically adapts the UI — themes, visuals, and content — based on their emotional state.

---

## Overview

This project explores the intersection of AI, deep learning, and frontend development. Using facial emotion recognition running entirely in the browser, the application personalises the user experience in real time — changing the interface's look and feel to match how the user is feeling.

---

## Features

- Real-time facial emotion detection via webcam using deep learning (face-api.js)
- Confidence thresholds and temporal smoothing to reduce false positives
- Custom emotion re-weighting logic to prevent dominant emotion lock-in
- Dynamic theming engine — UI adapts colours, visuals, and content based on detected emotion
- Full-stack architecture with React.js frontend and Spring Boot backend connected via REST APIs
- Supports detection of subtle emotions: happy, sad, angry, surprised, neutral, and more

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, JavaScript, CSS |
| AI / ML | face-api.js (TensorFlow.js models) |
| Backend | Spring Boot (Java) |
| Communication | REST APIs |
| Input | Webcam (browser MediaDevices API) |

---

## How It Works

```
Webcam Input
     │
     ▼
face-api.js (Deep Learning Model)
     │  Detects emotion + confidence scores
     ▼
Emotion Inference Engine
     │  Applies confidence thresholds
     │  Applies temporal smoothing
     │  Applies re-weighting logic
     ▼
Dominant Emotion State
     │
     ▼
React UI (Dynamic Theme Engine)
     │  Adapts colours, visuals, content
     ▼
Personalised User Interface
     │
     ▼
Spring Boot Backend (REST API)
     │  Logs sessions, manages game state
```

---

## Emotion → UI Mapping

| Detected Emotion | UI Adaptation |
|---|---|
| Happy | Bright colours, energetic visuals |
| Sad | Muted tones, calm content |
| Angry | High-contrast, reduced stimulation |
| Surprised | Dynamic animations |
| Neutral | Default balanced theme |

---

## Getting Started

### Prerequisites

- Node.js 16+
- Java JDK 11+
- Maven

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/Keerthana7654/AI-Emotion-Adaptive-UI-Dynamic-Frontend-that-changes-based-on-user-mood-.git

# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the React app
npm start
```

The app will run at `http://localhost:3000`. Allow webcam access when prompted.

### Backend Setup

```bash
# Navigate to backend
cd backend

# Build and run Spring Boot
mvn spring-boot:run
```

Backend runs at `http://localhost:8080`.

---

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── EmotionDetector.jsx   # Webcam + face-api.js logic
│   │   │   ├── ThemeEngine.jsx       # Dynamic UI adaptation
│   │   │   └── GameUI.jsx            # Main game interface
│   │   ├── utils/
│   │   │   ├── emotionSmoothing.js   # Temporal smoothing logic
│   │   │   └── reweighting.js        # Emotion re-weighting logic
│   │   └── App.jsx
│   └── public/
├── backend/
│   └── src/main/java/
│       ├── controllers/       # REST API endpoints
│       ├── services/          # Business logic
│       └── models/            # Data models
```

---

## Key Technical Decisions

**Temporal smoothing** — Instead of reacting to every frame's emotion output, the engine averages emotion scores over a rolling window. This prevents the UI from flickering between states.

**Emotion re-weighting** — Raw model outputs tend to over-predict dominant emotions. A custom weighting layer redistributes probability mass to surface subtle emotions like sadness and anger more accurately.

**Confidence thresholds** — Only emotion predictions above a set confidence score trigger a UI change, filtering out low-confidence noise from the model.

---

## Team

Built as a team academic project at GT College (Affiliated to Bangalore University) as part of the MCA programme.

---

## License

This project is for academic and learning purposes.
