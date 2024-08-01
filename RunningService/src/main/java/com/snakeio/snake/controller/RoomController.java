package com.snakeio.snake.controller;

import com.snakeio.snake.model.Room;
import com.snakeio.snake.payload.RoomPayload;
import com.snakeio.snake.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = {"*"},maxAge=3600)
public class RoomController {
    @Autowired
    private RoomService roomService;

    @GetMapping
    public List<RoomPayload> getAllRooms() {
        return roomService.getAllRooms();
    }

    @GetMapping("/{id}")
    public Room getRoomById(@PathVariable String id) {
        return roomService.getRoomById(id);
    }

    @PostMapping
    public Room createRoom(@RequestBody Room room) {
        return roomService.saveRoom(room);
    }

    @PutMapping("/{id}")
    public Room updateRoom(@PathVariable String id, @RequestBody Room room) {
        Room existingRoom = roomService.getRoomById(id);
        if (existingRoom != null) {
            existingRoom.setMaxPlayers(room.getMaxPlayers());
            existingRoom.setTimeLeft(room.getTimeLeft());
            return roomService.saveRoom(existingRoom);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void deleteRoom(@PathVariable String id) {
        roomService.deleteRoom(id);
    }

    @PostMapping("/{roomId}/players/{playerId}")
    public Room addPlayerToRoom(@PathVariable String roomId, @PathVariable String playerId) {
        System.out.println("addplayertoroom:"+roomId+","+playerId+"\n");
        return roomService.addPlayerToRoom(roomId, playerId);
    }

    @DeleteMapping("/{roomId}/players/{playerId}")
    public Room removePlayerFromRoom(@PathVariable String roomId, @PathVariable String playerId) {
        return roomService.removePlayerFromRoom(roomId, playerId);
    }
}