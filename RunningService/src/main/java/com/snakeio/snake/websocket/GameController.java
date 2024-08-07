package com.snakeio.snake.websocket;

import com.snakeio.snake.model.Player;
import com.snakeio.snake.payload.GameStateDTO;
import com.snakeio.snake.payload.PlayerMovePayload;
import com.snakeio.snake.service.GameService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.messaging.handler.annotation.DestinationVariable;
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

    @MessageMapping("/game/{roomId}/add")
    @SendTo("/topic/game/{roomId}/add")
    public Player addPlayer(@DestinationVariable String roomId, @Payload Player player) {
        gameService.addPlayerToRoom(roomId,player);
        System.out.println("add"+player+"\nroom:"+gameService.getFullState(roomId));
        return player;
    }


    @MessageMapping("/game/{roomId}/move")
    public void movePlayer(@DestinationVariable String roomId, @Payload PlayerMovePayload moveData) {
        gameService.movePlayer(roomId, moveData);
        System.out.println("move:"+gameService.getFullState(roomId).getPlayers().size()+":"+moveData.toString());
    }

    @MessageMapping("/game/{roomId}/removePlayer")
    @SendTo("/topic/game/{roomId}")
    public GameStateDTO removePlayer(@DestinationVariable String roomId, @Payload Player player) {
        gameService.removePlayerFromRoom(roomId, player);
        System.out.println("remove:"+gameService.getPlayersInRoom(roomId).size());

        return new GameStateDTO(gameService.getPlayersInRoom(roomId));
    }


}
