package com.moodplay.dto;
public class FeedbackRequest {
    private String sessionKey;
    private String emotion;
    private String rating;
    private String tags;
    private String note;
    public FeedbackRequest() {}
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
}
