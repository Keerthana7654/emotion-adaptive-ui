package com.moodplay.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "game_feedback")
public class GameFeedback {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_key", length = 100) private String sessionKey;
    @Column(length = 50)  private String emotion;
    @Column(length = 20)  private String rating;
    @Column(length = 500) private String tags;
    @Column(columnDefinition = "TEXT") private String note;
    @Column(name = "created_at", updatable = false) private LocalDateTime createdAt = LocalDateTime.now();

    public GameFeedback() {}

    public Long getId()                           { return id; }
    public void setId(Long id)                    { this.id = id; }
    public String getSessionKey()                 { return sessionKey; }
    public void setSessionKey(String sessionKey)  { this.sessionKey = sessionKey; }
    public String getEmotion()                    { return emotion; }
    public void setEmotion(String emotion)        { this.emotion = emotion; }
    public String getRating()                     { return rating; }
    public void setRating(String rating)          { this.rating = rating; }
    public String getTags()                       { return tags; }
    public void setTags(String tags)              { this.tags = tags; }
    public String getNote()                       { return note; }
    public void setNote(String note)              { this.note = note; }
    public LocalDateTime getCreatedAt()           { return createdAt; }
    public void setCreatedAt(LocalDateTime v)     { this.createdAt = v; }
}
