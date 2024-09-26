package com.snakeio.snake.controller;



import com.snakeio.snake.payload.GameStateDTO;
import com.snakeio.snake.service.GameService;
import org.springframework.web.bind.annotation.*;

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
        System.out.println("full state for roomID:"+roomId+"\n:"+gameService.getFullState(roomId));
        return gameService.getFullState(roomId)
                ;
    }
   @PutMapping("/{roomId}/players/{playerId}/{newscore}")
    public boolean updatePlayerStaticConfigInRoom(@PathVariable String roomId, @PathVariable String playerId,@PathVariable int newscore) {
        System.out.println("recieve updated score:"+newscore+","+playerId);
        return gameService.updatePlayerStaticConfigInRoom(roomId,playerId,newscore);
    }


}
