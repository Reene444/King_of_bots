package com.snakeio.snake.service;

import com.snakeio.snake.model.Player;
import org.springframework.stereotype.Service;

import java.util.Iterator;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class GameService {

//    private List<Player> players;
//
//    public GameService(List<Player> initialPlayers) {
//        this.players = initialPlayers;
//    }
//
//    public synchronized List<Player> getPlayers() {
//        return players;
//    }
//
//    public synchronized void addPlayer(Player player) {
//
////        players.add(player);
//        if (players.stream().noneMatch(p -> p.getId().equals(player.getId()))) {
//            players.add(player);
//            System.out.println("Player added: " + player);
//        }
//    }
//
//    public synchronized void movePlayer(Player updatedPlayer) {
//        if (players != null) {
//            for (Player player : players) {
//                if (player != null) {
//                    if (player.getId().equals(updatedPlayer.getId())) {
//                        player.setSegments(updatedPlayer.getSegments());
//                        player.setScore(updatedPlayer.getScore());
//                        player.setX(updatedPlayer.getX());
//                        player.setY(updatedPlayer.getY());
//                        player.setType(updatedPlayer.getType()); // 确保更新类型
//                    }
//                }
//            }
//        }
//    }
//
//    public synchronized void removePlayer(Player player) {
//        players.removeIf(p -> p.getId().equals(player.getId()));
//        System.out.println(player.getId() + players);
//    }

    private final ConcurrentHashMap<String, CopyOnWriteArrayList<Player>> roomPlayers = new ConcurrentHashMap<>();

    public void addPlayerToRoom(String roomId, Player player) {
        roomPlayers.computeIfAbsent(roomId, k -> new CopyOnWriteArrayList<>()).add(player);
    }

    public void removePlayerFromRoom(String roomId, Player player) {
        CopyOnWriteArrayList<Player> players = roomPlayers.get(roomId);
        if (players != null) {
            players.remove(player);
        }
    }
    public void movePlayerInRoom(String roomId, Player updatedPlayer) {
        CopyOnWriteArrayList<Player> players = roomPlayers.get(roomId);
        if (players != null) {
            for (int i = 0; i < players.size(); i++) {
                Player player = players.get(i);
                if (player.getId().equals(updatedPlayer.getId())) {
                    players.set(i, updatedPlayer);
                    break;
                }
            }
        }
    }
    public List<Player> getPlayersInRoom(String roomId) {
        return roomPlayers.getOrDefault(roomId, new CopyOnWriteArrayList<>());
    }
}
