package com.snakeio.snake.controller;

import com.snakeio.snake.model.Player;
import com.snakeio.snake.service.GameService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Controller
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @MessageMapping("/game.addPlayer")
    @SendTo("/topic/game")
    public GameState addPlayer(@Payload Player player) {
        gameService.addPlayer(player);
        System.out.println("add");
        return new GameState(gameService.getPlayers());
    }

    @MessageMapping("/game.movePlayer")
    @SendTo("/topic/game")
    public GameState movePlayer(@Payload Player updatedPlayer) {
        gameService.movePlayer(updatedPlayer);
        System.out.println("move");
        return new GameState(gameService.getPlayers());
    }

    @MessageMapping("/game.removePlayer")
    @SendTo("/topic/game")
    public GameState removePlayer(@Payload Player player) {
        gameService.removePlayer(player);
        return new GameState(gameService.getPlayers());
    }


    @Setter
    @Getter
    public static class GameState {
        private List<Player> players;

        public GameState(List<Player> players) {
            this.players = players;
        }

    }
}
