package com.moodplay.dto;
public class SessionRequest {
    private String sessionKey;
    private String emotion;
    private String expressionsJson;
    public SessionRequest() {}
    public String getSessionKey()                   { return sessionKey; }
    public void setSessionKey(String sessionKey)    { this.sessionKey = sessionKey; }
    public String getEmotion()                      { return emotion; }
    public void setEmotion(String emotion)          { this.emotion = emotion; }
    public String getExpressionsJson()              { return expressionsJson; }
    public void setExpressionsJson(String v)        { this.expressionsJson = v; }
}
