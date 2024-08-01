package com.snakeio.snake.service;


import com.snakeio.snake.model.Room;
import com.snakeio.snake.payload.RoomPayload;
import com.snakeio.snake.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomService {
    @Autowired
    private RoomRepository roomRepository;

    public List<RoomPayload> getAllRooms() {
        return roomRepository.findAll().stream()
                .map(room -> new RoomPayload(room.getId(), room.getPlayersCount(), room.getMaxPlayers(), room.getTimeLeft()))
                .collect(Collectors.toList());
    }

    public Room getRoomById(String id) {
        return roomRepository.findById(id).orElse(null);
    }

    public Room saveRoom(Room room) {
        return roomRepository.save(room);
    }

    public void deleteRoom(String id) {
        roomRepository.deleteById(id);
    }

    public Room addPlayerToRoom(String roomId, String playerId) {
        Room room = getRoomById(roomId);
        System.out.println("Room found: " + room);
        if (room != null && room.getPlayersCount() < room.getMaxPlayers()) {
            room.addPlayer(playerId);
            System.out.println("Player added: " + playerId);
            return saveRoom(room);
        }
        return null;
    }

    public Room removePlayerFromRoom(String roomId, String playerId) {
        Room room = getRoomById(roomId);
        if (room != null) {
            room.removePlayer(playerId);
            return saveRoom(room);
        }
        return null;
    }
}