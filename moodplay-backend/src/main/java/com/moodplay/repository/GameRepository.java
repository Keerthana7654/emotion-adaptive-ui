package com.moodplay.repository;

import com.moodplay.entity.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    List<Game> findByActiveTrue();
    List<Game> findByMoodAndActiveTrue(String mood);
    boolean existsBySrc(String src);
}
