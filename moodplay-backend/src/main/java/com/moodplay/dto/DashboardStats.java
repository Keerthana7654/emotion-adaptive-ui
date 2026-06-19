package com.moodplay.dto;
import java.util.Map;
public class DashboardStats {
    private long totalSessions;
    private long totalFeedback;
    private long totalGames;
    private String topEmotion;
    private Map<String, Long> emotionBreakdown;
    private Map<String, Long> ratingBreakdown;
    public DashboardStats() {}
    public long getTotalSessions()                              { return totalSessions; }
    public void setTotalSessions(long totalSessions)            { this.totalSessions = totalSessions; }
    public long getTotalFeedback()                              { return totalFeedback; }
    public void setTotalFeedback(long totalFeedback)            { this.totalFeedback = totalFeedback; }
    public long getTotalGames()                                 { return totalGames; }
    public void setTotalGames(long totalGames)                  { this.totalGames = totalGames; }
    public String getTopEmotion()                               { return topEmotion; }
    public void setTopEmotion(String topEmotion)                { this.topEmotion = topEmotion; }
    public Map<String, Long> getEmotionBreakdown()              { return emotionBreakdown; }
    public void setEmotionBreakdown(Map<String, Long> v)        { this.emotionBreakdown = v; }
    public Map<String, Long> getRatingBreakdown()               { return ratingBreakdown; }
    public void setRatingBreakdown(Map<String, Long> v)         { this.ratingBreakdown = v; }
}
