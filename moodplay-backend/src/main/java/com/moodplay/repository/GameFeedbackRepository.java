package com.moodplay.repository;

import com.moodplay.entity.GameFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GameFeedbackRepository extends JpaRepository<GameFeedback, Long> {
    List<GameFeedback> findTop50ByOrderByCreatedAtDesc();

    @Query("SELECT f.rating, COUNT(f) FROM GameFeedback f GROUP BY f.rating ORDER BY COUNT(f) DESC")
    List<Object[]> countByRating();

    @Query("SELECT f.emotion, COUNT(f) FROM GameFeedback f GROUP BY f.emotion")
    List<Object[]> countByEmotion();
}
