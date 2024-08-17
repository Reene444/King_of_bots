package com.snakeio.snake.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.tomcat.util.json.JSONParser;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Document(collection = "rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
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

    public boolean removePlayer(String playerId) {
        System.out.println("current hashset:"+players);
        boolean rt=players.remove(playerId);
        System.out.println("result:"+rt);
       return rt;
    }
}