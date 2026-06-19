package com.moodplay.controller;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.moodplay.dto.DashboardStats;
import com.moodplay.dto.GameRequest;
import com.moodplay.dto.GameResponse;
import com.moodplay.entity.EmotionSession;
import com.moodplay.entity.GameFeedback;
import com.moodplay.repository.EmotionSessionRepository;
import com.moodplay.repository.GameFeedbackRepository;
import com.moodplay.service.GameService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final GameService              gameService;
    private final EmotionSessionRepository sessionRepo;
    private final GameFeedbackRepository   feedbackRepo;

    public AdminController(GameService gameService,
                           EmotionSessionRepository sessionRepo,
                           GameFeedbackRepository feedbackRepo) {
        this.gameService  = gameService;
        this.sessionRepo  = sessionRepo;
        this.feedbackRepo = feedbackRepo;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getStats() {
        DashboardStats stats = new DashboardStats();
        stats.setTotalSessions(sessionRepo.count());
        stats.setTotalFeedback(feedbackRepo.count());
        stats.setTotalGames((long) gameService.getAllActive().size());

        Map<String, Long> emotionMap = new LinkedHashMap<>();
        String topEmotion = "";
        long topCount = 0;
        for (Object[] row : sessionRepo.countByEmotion()) {
            String emotion = (String) row[0];
            Long   count   = (Long)   row[1];
            emotionMap.put(emotion, count);
            if (count > topCount) { topCount = count; topEmotion = emotion; }
        }
        stats.setEmotionBreakdown(emotionMap);
        stats.setTopEmotion(topEmotion.isEmpty() ? "none" : topEmotion);

        Map<String, Long> ratingMap = new LinkedHashMap<>();
        for (Object[] row : feedbackRepo.countByRating()) {
            ratingMap.put((String) row[0], (Long) row[1]);
        }
        stats.setRatingBreakdown(ratingMap);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<EmotionSession>> getSessions() {
        return ResponseEntity.ok(sessionRepo.findTop50ByOrderByCreatedAtDesc());
    }

    @GetMapping("/feedback")
    public ResponseEntity<List<GameFeedback>> getFeedback() {
        return ResponseEntity.ok(feedbackRepo.findTop50ByOrderByCreatedAtDesc());
    }

    @GetMapping("/games")
    public ResponseEntity<List<GameResponse>> getAllGames() {
        return ResponseEntity.ok(gameService.getAll());
    }

    @PostMapping("/games")
    public ResponseEntity<?> addGame(@RequestBody GameRequest req, Authentication auth) {
        try {
            return ResponseEntity.ok(gameService.addGame(req, auth.getName()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/games/{id}/toggle")
    public ResponseEntity<GameResponse> toggleGame(@PathVariable Long id) {
        return ResponseEntity.ok(gameService.toggleActive(id));
    }

    @DeleteMapping("/games/{id}")
    public ResponseEntity<Void> deleteGame(@PathVariable Long id) {
        gameService.deleteGame(id);
        return ResponseEntity.noContent().build();
    }
}
