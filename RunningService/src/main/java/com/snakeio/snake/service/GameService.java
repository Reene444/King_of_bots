package com.snakeio.snake.service;

import com.snakeio.snake.payload.GameStateDTO;
// import com.snakeio.snake.websocket.GameController;
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

        System.out.println("add in db in websocket outcome："+roomPlayers.computeIfAbsent(roomId, k -> new CopyOnWriteArrayList<>()).add(player));
    }

    public void removePlayerFromRoom(String roomId, Player player) {
        CopyOnWriteArrayList<Player> players = roomPlayers.get(roomId);
        if (players != null) {
            System.out.println("Current players in room " + roomId + ": " + players);
            System.out.println("whether player in the players list:"+players.contains(player));
            System.out.println("remove from websocket outcome："+players.remove(player));
        }

        System.out.println("remove from websocket process end");
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
                            // player.setScore(moveData.getScore());
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
    public boolean updatePlayerStaticConfigInRoom(String roomId,String playerId,int score){
        // 获取房间中的玩家列表
    CopyOnWriteArrayList<Player> players = roomPlayers.get(roomId);
    if (players != null) {
        for (Player player : players) {
            if (player.getId().equals(playerId)) {
                synchronized (player) { // 锁定当前玩家对象以确保线程安全
                    // 更新分数
                    player.setScore(score);
                    // 发送分数更新到客户端
                    messagingTemplate.convertAndSend("/topic/game/" + roomId + "/scoreUpdate", player);
                    System.out.println("update success for score");
                    return true; // 更新成功
                }
            }
        }
    }
    System.out.println("update fail for score");
    return false; // 玩家未找到
    }
    public List<Player> getPlayersInRoom(String roomId) {
        return roomPlayers.getOrDefault(roomId, new CopyOnWriteArrayList<>());
    }
}
