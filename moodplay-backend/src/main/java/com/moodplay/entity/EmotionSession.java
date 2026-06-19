package com.moodplay.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "emotion_sessions")
public class EmotionSession {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_key", length = 100) private String sessionKey;
    @Column(nullable = false, length = 50)       private String emotion;
    @Column(name = "expressions_json", columnDefinition = "TEXT") private String expressionsJson;
    @Column(name = "created_at", updatable = false) private LocalDateTime createdAt = LocalDateTime.now();

    public EmotionSession() {}

    public Long getId()                             { return id; }
    public void setId(Long id)                      { this.id = id; }
    public String getSessionKey()                   { return sessionKey; }
    public void setSessionKey(String sessionKey)    { this.sessionKey = sessionKey; }
    public String getEmotion()                      { return emotion; }
    public void setEmotion(String emotion)          { this.emotion = emotion; }
    public String getExpressionsJson()              { return expressionsJson; }
    public void setExpressionsJson(String v)        { this.expressionsJson = v; }
    public LocalDateTime getCreatedAt()             { return createdAt; }
    public void setCreatedAt(LocalDateTime v)       { this.createdAt = v; }
}
