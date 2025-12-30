import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import "./App.css";

export default function App() {
  const videoRef = useRef();
  const [emotion, setEmotion] = useState("neutral");
  const [theme, setTheme] = useState("normal");

  useEffect(() => {
    startVideo();
    loadModels();
  }, []);

  const loadModels = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceapi.nets.faceExpressionNet.loadFromUri("/models");
    detectEmotion();
  };

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => videoRef.current.srcObject = stream);
  };

  const detectEmotion = () => {
    setInterval(async () => {
      if (!videoRef.current) return;

      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections && detections.expressions) {
        const exp = detections.expressions;
        const maxEmotion = Object.keys(exp).reduce((a,b)=>exp[a]>exp[b]?a:b);
        setEmotion(maxEmotion);
        sendEmotion(maxEmotion);
      }
    }, 1500);
  };

  const sendEmotion = async (emo) => {
    const res = await axios.post("http://localhost:8081/adapt", { emotion: emo });
    setTheme(res.data.theme);
  };

  return (
    <div className={`app ${theme}`}>
      <h1>AI Emotion-Adaptive UI</h1>
      <video ref={videoRef} autoPlay muted width="320" />
      <p>Detected Emotion: {emotion}</p>
    </div>
  );
}
