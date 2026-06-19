package com.moodplay.controller;

import com.moodplay.dto.GameResponse;
import com.moodplay.service.GameService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/games")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    /** Public — returns all active games (used by the React frontend) */
    @GetMapping
    public List<GameResponse> getActiveGames() {
        return gameService.getAllActive();
    }
}
