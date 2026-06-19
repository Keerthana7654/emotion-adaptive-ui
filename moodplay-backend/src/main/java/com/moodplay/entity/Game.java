package com.moodplay.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "games")
public class Game {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200) private String name;
    @Column(nullable = false, length = 500) private String src;
    @Column(nullable = false, length = 50)  private String mood;
    @Column(length = 300)                    private String tags;
    @Column(nullable = false)               private boolean active = true;
    @Column(name = "added_by", length = 100) private String addedBy;
    @Column(name = "created_at", updatable = false) private LocalDateTime createdAt = LocalDateTime.now();

    public Game() {}

    public Long getId()                   { return id; }
    public void setId(Long id)            { this.id = id; }
    public String getName()               { return name; }
    public void setName(String name)      { this.name = name; }
    public String getSrc()                { return src; }
    public void setSrc(String src)        { this.src = src; }
    public String getMood()               { return mood; }
    public void setMood(String mood)      { this.mood = mood; }
    public String getTags()               { return tags; }
    public void setTags(String tags)      { this.tags = tags; }
    public boolean isActive()             { return active; }
    public void setActive(boolean active) { this.active = active; }
    public String getAddedBy()            { return addedBy; }
    public void setAddedBy(String addedBy){ this.addedBy = addedBy; }
    public LocalDateTime getCreatedAt()               { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
