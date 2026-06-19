package com.moodplay.repository;

import com.moodplay.entity.EmotionSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EmotionSessionRepository extends JpaRepository<EmotionSession, Long> {
    List<EmotionSession> findTop50ByOrderByCreatedAtDesc();

    @Query("SELECT e.emotion, COUNT(e) FROM EmotionSession e GROUP BY e.emotion ORDER BY COUNT(e) DESC")
    List<Object[]> countByEmotion();
}
