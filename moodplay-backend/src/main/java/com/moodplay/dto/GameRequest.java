package com.moodplay.dto;
public class GameRequest {
    private String name;
    private String src;
    private String mood;
    private String tags;
    public GameRequest() {}
    public String getName()           { return name; }
    public void setName(String name)  { this.name = name; }
    public String getSrc()            { return src; }
    public void setSrc(String src)    { this.src = src; }
    public String getMood()           { return mood; }
    public void setMood(String mood)  { this.mood = mood; }
    public String getTags()           { return tags; }
    public void setTags(String tags)  { this.tags = tags; }
}
