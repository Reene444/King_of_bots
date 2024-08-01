package com.snakeio.snake.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.HashSet;
import java.util.Set;

@Document(collection = "rooms")
@Data
public class Room {

    @Id
    private String id;
    @Field("players")
    private Set<String> players = new HashSet<>();
    private int maxPlayers;
    private int timeLeft;

    // Getters and Setters
    public int getPlayersCount() {
        return players.size();
    }

    public void addPlayer(String playerId) {
        players.add(playerId);
    }

    public void removePlayer(String playerId) {
        players.remove(playerId);
    }
}