package com.snakeio.snake.controller;

import com.snakeio.snake.model.Player;
import com.snakeio.snake.service.GameService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

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
        return new GameState(gameService.getPlayers());
    }

    @MessageMapping("/game.movePlayer")
    @SendTo("/topic/game")
    public GameState movePlayer(@Payload Player updatedPlayer) {
        gameService.movePlayer(updatedPlayer);
        return new GameState(gameService.getPlayers());
    }

    @MessageMapping("/game.removePlayer")
    @SendTo("/topic/game")
    public GameState removePlayer(@Payload Player player) {
        gameService.removePlayer(player);
        return new GameState(gameService.getPlayers());
    }

    static class GameState {
        private List<Player> players;

        public GameState(List<Player> players) {
            this.players = players;
        }

        public List<Player> getPlayers() {
            return players;
        }

        public void setPlayers(List<Player> players) {
            this.players = players;
        }
    }
}
