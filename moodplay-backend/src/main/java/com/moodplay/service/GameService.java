package com.moodplay.service;

import com.moodplay.dto.GameRequest;
import com.moodplay.dto.GameResponse;
import com.moodplay.entity.Game;
import com.moodplay.repository.GameRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GameService {

    private final GameRepository gameRepo;
    private final SimpMessagingTemplate ws;

    public GameService(GameRepository gameRepo, SimpMessagingTemplate ws) {
        this.gameRepo = gameRepo;
        this.ws = ws;
    }

    public List<GameResponse> getAllActive() {
        return gameRepo.findByActiveTrue().stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<GameResponse> getAll() {
        return gameRepo.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public GameResponse addGame(GameRequest req, String adminUsername) {
        if (gameRepo.existsBySrc(req.getSrc())) {
            throw new IllegalArgumentException("A game with this URL already exists.");
        }
        Game game = new Game();
        game.setName(req.getName());
        game.setSrc(req.getSrc());
        game.setMood(req.getMood().toLowerCase());
        game.setTags(req.getTags());
        game.setActive(true);
        game.setAddedBy(adminUsername);
        game.setCreatedAt(LocalDateTime.now());
        game = gameRepo.save(game);
        GameResponse dto = toDto(game);
        ws.convertAndSend("/topic/games", dto);
        return dto;
    }

    public GameResponse toggleActive(Long id) {
        Game game = gameRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Game not found: " + id));
        game.setActive(!game.isActive());
        game = gameRepo.save(game);
        GameResponse dto = toDto(game);
        if (!game.isActive()) {
            ws.convertAndSend("/topic/games/delete", id);
        } else {
            ws.convertAndSend("/topic/games", dto);
        }
        return dto;
    }

    public void deleteGame(Long id) {
        gameRepo.deleteById(id);
        ws.convertAndSend("/topic/games/delete", id);
    }

    private GameResponse toDto(Game g) {
        GameResponse r = new GameResponse();
        r.setId(g.getId());
        r.setName(g.getName());
        r.setSrc(g.getSrc());
        r.setMood(g.getMood());
        r.setTags(g.getTags());
        r.setActive(g.isActive());
        r.setAddedBy(g.getAddedBy());
        r.setCreatedAt(g.getCreatedAt());
        return r;
    }
}
