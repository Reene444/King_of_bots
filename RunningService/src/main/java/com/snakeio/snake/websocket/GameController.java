    package com.snakeio.snake.websocket;

    import com.snakeio.snake.model.Player;
    import com.snakeio.snake.payload.GameStateDTO;
import com.snakeio.snake.payload.HeartbeatPayload;
import com.snakeio.snake.payload.PlayerMovePayload;
    import com.snakeio.snake.service.GameService;
    import com.snakeio.snake.service.RoomService;
    import lombok.Getter;
    import lombok.Setter;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.messaging.handler.annotation.DestinationVariable;
    import org.springframework.messaging.handler.annotation.MessageMapping;
    import org.springframework.messaging.handler.annotation.Payload;
    import org.springframework.messaging.handler.annotation.SendTo;
    import org.springframework.stereotype.Controller;

    import java.util.List;

    @Controller
    public class GameController {
        private final GameService gameService;
        @Autowired
        private RoomService roomService;

        public GameController(GameService gameService) {
            this.gameService = gameService;
        }
        @MessageMapping("/heartbeat")
        public void handleHeartbeat(@Payload HeartbeatPayload payload) {
            // 处理心跳消息
            System.out.println("Heartbeat received: " + payload);
         
        }

        @MessageMapping("/game.{roomId}.add")
        @SendTo("/topic/game.{roomId}.add")
        public Player addPlayer(@DestinationVariable String roomId, @Payload Player player) {
            gameService.addPlayerToRoom(roomId,player);
            roomService.addPlayerToRoom(roomId,player.getId());
            System.out.println("add"+player+"\nroom:"+gameService.getFullState(roomId).toString());
            return player;
        }

       
        @MessageMapping("/game.{roomId}.move")
        public void movePlayer(@DestinationVariable String roomId, @Payload PlayerMovePayload moveData) {
            gameService.movePlayer(roomId, moveData);
            System.out.println("move:"+gameService.getFullState(roomId).getPlayers().size()+":"+moveData.toString());
        }

        @MessageMapping("/game.{roomId}.removePlayer")
        @SendTo("/topic/game.{roomId}.remove")
        public Player removePlayer(@DestinationVariable String roomId, @Payload Player player) {
            gameService.removePlayerFromRoom(roomId, player);
            roomService.removePlayerFromRoom(roomId,player.getId());
            System.out.println("remove from websocket:"+gameService.getPlayersInRoom(roomId).size()+roomId+player+'\n'+gameService.getFullState(roomId));
            return player;
        }


    }
