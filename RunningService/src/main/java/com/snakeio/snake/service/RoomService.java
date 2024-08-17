package com.snakeio.snake.service;


import com.snakeio.snake.model.Player;
import com.snakeio.snake.model.Room;
import com.snakeio.snake.payload.PlayerViewPayload;
import com.snakeio.snake.payload.RoomPayload;
import com.snakeio.snake.repository.PlayerRepository;
import com.snakeio.snake.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RoomService {
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private PlayerRepository playerRepository;

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

    public List<PlayerViewPayload> getPlayerInRoom(String roomId) {
        Room room = getRoomById(roomId);
        List<PlayerViewPayload>playerlist=new ArrayList<>();
        if(room!=null){
            Set<String> players = room.getPlayers();
            for(String  player: players){
                Optional<Player> foundPlayer= playerRepository.findById(player);
                foundPlayer.ifPresent(value -> playerlist.add(new PlayerViewPayload(value.getId(), value.getNickname(),value.getISOcode(),value.getScore())));
            }
        }
        return playerlist;
    }
}