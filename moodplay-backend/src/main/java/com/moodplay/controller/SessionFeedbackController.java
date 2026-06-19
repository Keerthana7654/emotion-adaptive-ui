package com.moodplay.controller;

import com.moodplay.dto.FeedbackRequest;
import com.moodplay.dto.SessionRequest;
import com.moodplay.entity.EmotionSession;
import com.moodplay.entity.GameFeedback;
import com.moodplay.repository.EmotionSessionRepository;
import com.moodplay.repository.GameFeedbackRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api")
public class SessionFeedbackController {

    private final EmotionSessionRepository sessionRepo;
    private final GameFeedbackRepository   feedbackRepo;

    public SessionFeedbackController(EmotionSessionRepository sessionRepo,
                                     GameFeedbackRepository feedbackRepo) {
        this.sessionRepo  = sessionRepo;
        this.feedbackRepo = feedbackRepo;
    }

    @PostMapping("/sessions")
    public ResponseEntity<EmotionSession> saveSession(@RequestBody SessionRequest req) {
        EmotionSession session = new EmotionSession();
        session.setSessionKey(req.getSessionKey());
        session.setEmotion(req.getEmotion());
        session.setExpressionsJson(req.getExpressionsJson());
        session.setCreatedAt(LocalDateTime.now());
        return ResponseEntity.ok(sessionRepo.save(session));
    }

    @PostMapping("/feedback")
    public ResponseEntity<GameFeedback> saveFeedback(@RequestBody FeedbackRequest req) {
        GameFeedback fb = new GameFeedback();
        fb.setSessionKey(req.getSessionKey());
        fb.setEmotion(req.getEmotion());
        fb.setRating(req.getRating());
        fb.setTags(req.getTags());
        fb.setNote(req.getNote());
        fb.setCreatedAt(LocalDateTime.now());
        return ResponseEntity.ok(feedbackRepo.save(fb));
    }
}
