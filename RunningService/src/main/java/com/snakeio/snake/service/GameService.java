package com.snakeio.snake.service;

import com.snakeio.snake.model.Player;
import org.springframework.stereotype.Service;

import java.util.Iterator;
import java.util.List;

@Service
public class GameService {

    private List<Player> players;

    public GameService(List<Player> initialPlayers) {
        this.players = initialPlayers;
    }

    public List<Player> getPlayers() {
        return players;
    }

    public void addPlayer(Player player) {
        players.add(player);
    }

    public void movePlayer(Player updatedPlayer) {
        if (players != null) {
            Iterator<Player> iterator = players.iterator();
            while (iterator.hasNext()) {
                Player player = iterator.next();
                if (player != null) {
                    if (player.getId().equals(updatedPlayer.getId())) {
                        player.setSegments(updatedPlayer.getSegments());
                    }
                }
            }
        }
    }
    public void removePlayer(Player player) {
        synchronized (players) {
            Iterator<Player> iterator = players.iterator();
            while (iterator.hasNext()) {
                Player p = iterator.next();
                if (p.getId().equals(player.getId())) {
                    iterator.remove();
                    break;
                }
            }
        }
        System.out.println(player.getId()+players);
    }
}
