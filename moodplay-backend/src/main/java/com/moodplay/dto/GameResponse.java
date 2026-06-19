package com.moodplay.dto;
import java.time.LocalDateTime;
public class GameResponse {
    private Long id;
    private String name;
    private String src;
    private String mood;
    private String tags;
    private boolean active;
    private String addedBy;
    private LocalDateTime createdAt;
    public GameResponse() {}
    public Long getId()                             { return id; }
    public void setId(Long id)                      { this.id = id; }
    public String getName()                         { return name; }
    public void setName(String name)                { this.name = name; }
    public String getSrc()                          { return src; }
    public void setSrc(String src)                  { this.src = src; }
    public String getMood()                         { return mood; }
    public void setMood(String mood)                { this.mood = mood; }
    public String getTags()                         { return tags; }
    public void setTags(String tags)                { this.tags = tags; }
    public boolean isActive()                       { return active; }
    public void setActive(boolean active)           { this.active = active; }
    public String getAddedBy()                      { return addedBy; }
    public void setAddedBy(String addedBy)          { this.addedBy = addedBy; }
    public LocalDateTime getCreatedAt()             { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt){ this.createdAt = createdAt; }
}
