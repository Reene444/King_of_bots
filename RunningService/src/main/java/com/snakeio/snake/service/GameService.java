package com.snakeio.snake.service;

import com.snakeio.snake.payload.GameStateDTO;
import com.snakeio.snake.websocket.GameController;
import com.snakeio.snake.model.Player;
import com.snakeio.snake.payload.PlayerMovePayload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class GameService {

    private final ConcurrentHashMap<String, CopyOnWriteArrayList<Player>> roomPlayers = new ConcurrentHashMap<>();
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void addPlayerToRoom(String roomId, Player player) {
        roomPlayers.computeIfAbsent(roomId, k -> new CopyOnWriteArrayList<>()).add(player);
    }

    public void removePlayerFromRoom(String roomId, Player player) {
        CopyOnWriteArrayList<Player> players = roomPlayers.get(roomId);
        if (players != null) {
            players.remove(player);
        }
    }

    public GameStateDTO getFullState(String roomId) {
        List<Player> players = roomPlayers.getOrDefault(roomId, new CopyOnWriteArrayList<>());
        return new GameStateDTO(players);
    }

    public void movePlayer(String roomId, PlayerMovePayload moveData) {
        CopyOnWriteArrayList<Player> players = roomPlayers.get(roomId);
        if (players != null) {
            for (Player player : players) {
                if (player.getId().equals(moveData.getId())) {
                    List<Player.Segment> segments = player.getSegments();
                    synchronized (segments) {
                        // 检查时间戳，只有当新的时间戳比当前的时间戳大时才处理消息
                        if (moveData.getTimestamp() > player.getLastUpdateTime()) {
                            if (!segments.isEmpty()) {
                                segments.add(0, moveData.getHead());
                                if (segments.size() > 1) {
                                    segments.remove(segments.size() - 1);
                                }
                            } else {
                                segments.add(moveData.getHead());
                            }
                            player.setSegments(segments);
                            player.setLastUpdateTime(moveData.getTimestamp());
                        } else {
                            // 忽略较旧的消息
                            System.out.println("Ignoring outdated move data");
                            return;
                        }
                    }
                    player.setSegments(segments);
                    messagingTemplate.convertAndSend("/topic/game/" + roomId+"/move", moveData);
                    break;
                }
            }
        }
    }
    public List<Player> getPlayersInRoom(String roomId) {
        return roomPlayers.getOrDefault(roomId, new CopyOnWriteArrayList<>());
    }
}
