package com.snakeio.snake.controller;



import com.snakeio.snake.model.Player;
import com.snakeio.snake.payload.GameStateDTO;
import com.snakeio.snake.service.GameService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/game")
@CrossOrigin(origins = {"*"},maxAge=3600)
public class GameRestController {

    private final GameService gameService;

    public GameRestController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping("/{roomId}/fullstate")
    public GameStateDTO getFullGameState(@PathVariable String roomId) {
        return gameService.getFullState(roomId);
    }


}
