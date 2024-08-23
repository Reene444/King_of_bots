package com.snakeio.snake.service;

import com.snakeio.snake.model.Player;
import com.snakeio.snake.payload.GameStateDTO;
import com.snakeio.snake.payload.PlayerMovePayload;
import org.redisson.api.RedissonClient;
import org.redisson.api.RList;
import org.redisson.api.RMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GameService {

    @Autowired
    private RedissonClient redissonClient;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private static final String ROOM_KEY_PREFIX = "room:";
    private static final String PLAYERS_KEY_PREFIX = "players:";
    public void addPlayerToRoom(String roomId, Player player) {
        String key = ROOM_KEY_PREFIX + roomId+":"+PLAYERS_KEY_PREFIX;
        RList<Player> playerList = redissonClient.getList(key);
        playerList.add(player);
        System.out.println("Added player to room: " + roomId);
    }

    public void removePlayerFromRoom(String roomId, Player player) {
        String key = ROOM_KEY_PREFIX + roomId+":"+PLAYERS_KEY_PREFIX;
        RList<Player> playerList = redissonClient.getList(key);
        playerList.remove(player);
        System.out.println("Removed player from room: " + roomId);
    }

    public GameStateDTO getFullState(String roomId) {
        String key = ROOM_KEY_PREFIX + roomId+":"+PLAYERS_KEY_PREFIX;
        RList<Player> playerList = redissonClient.getList(key);
        List<Player> players = playerList.readAll();
        return new GameStateDTO(players);
    }

    public void movePlayer(String roomId, PlayerMovePayload moveData) {
        String key = ROOM_KEY_PREFIX + roomId+":"+PLAYERS_KEY_PREFIX;
        RList<Player> playerList = redissonClient.getList(key);
        List<Player> players = playerList.readAll();
        for (Player player : players) {
            if (player.getId().equals(moveData.getId())) {
                List<Player.Segment> segments = player.getSegments();
                synchronized (segments) {
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
                        System.out.println("Ignoring outdated move data");
                        return;
                    }
                }
                playerList.set(players.indexOf(player), player);
                messagingTemplate.convertAndSend("/topic/game/" + roomId + "/move", moveData);
                break;
            }
        }
    }

    public boolean updatePlayerStaticConfigInRoom(String roomId, String playerId, int score) {
        String key = ROOM_KEY_PREFIX + roomId+":"+PLAYERS_KEY_PREFIX;
        RList<Player> playerList = redissonClient.getList(key);
        List<Player> players = playerList.readAll();
        for (Player player : players) {
            if (player.getId().equals(playerId)) {
                synchronized (player) {
                    player.setScore(score);
                    playerList.set(players.indexOf(player), player);
                    messagingTemplate.convertAndSend("/topic/game/" + roomId + "/scoreUpdate", player);
                    System.out.println("Score update success for player: " + playerId);
                    return true;
                }
            }
        }
        System.out.println("Score update failed for player: " + playerId);
        return false;
    }

    public List<Player> getPlayersInRoom(String roomId) {
        String key = ROOM_KEY_PREFIX + roomId+":"+PLAYERS_KEY_PREFIX;
        RList<Player> playerList = redissonClient.getList(key);
        return playerList.readAll();
    }
}
