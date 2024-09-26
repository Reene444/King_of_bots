package com.snakeio.snake.controller;

import com.snakeio.snake.model.Player;
import com.snakeio.snake.model.Room;
import com.snakeio.snake.payload.PlayerViewPayload;
import com.snakeio.snake.payload.RoomPayload;
import com.snakeio.snake.repository.PlayerRepository;
import com.snakeio.snake.service.GameService;
import com.snakeio.snake.service.PlayerService;
import com.snakeio.snake.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = {"*"},maxAge=3600)
public class RoomController {
    @Autowired
    private RoomService roomService;
    @Autowired
    private PlayerService playerService;
    @GetMapping
    public List<RoomPayload> getAllRooms() {
        return roomService.getAllRooms();
    }

    @GetMapping("/{roomId}")
    public Room getRoomById(@PathVariable String roomId) {
        System.out.println("rooms:");
        return roomService.getRoomById(roomId);
    }

    @PostMapping
    public Room createRoom(@RequestBody Room room) {
        return roomService.saveRoom(room);
    }

    @PutMapping("/{roomId}")
    public Room updateRoom(@PathVariable String roomId, @RequestBody Room room) {
        Room existingRoom = roomService.getRoomById(roomId);
        if (existingRoom != null) {
            existingRoom.setMaxPlayers(room.getMaxPlayers());
            existingRoom.setTimeLeft(room.getTimeLeft());
            return roomService.saveRoom(existingRoom);
        }
        return null;
    }

    @DeleteMapping("/{roomId}")
    public void deleteRoom(@PathVariable String roomId) {
        roomService.deleteRoom(roomId);
    }

    @GetMapping("/{roomId}/players")
    public List<PlayerViewPayload> PlayersInRoom(@PathVariable String roomId) {
        System.out.println("playertoroom:"+roomId+"\n");
        return roomService.getPlayerInRoom(roomId);
    }
    @PostMapping("/{roomId}/players")
    public void addPlayerToRoom(@PathVariable String roomId,@RequestBody Player player) {
//        System.out.println("addplayertoroom:"+roomId+","+player.getId()+"\n");
         playerService.savePlayer(player);
         roomService.addPlayerToRoom(roomId, player.getId());

    }

    @DeleteMapping("/{roomId}/players/{playerId}")
    public Room removePlayerFromRoom(@PathVariable String roomId, @PathVariable String playerId) {
        System.out.println("removeController player from room:"+roomId+","+playerId);
        return roomService.removePlayerFromRoom(roomId, playerId);
    }
}