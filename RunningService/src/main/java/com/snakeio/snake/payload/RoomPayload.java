package com.snakeio.snake.payload;

import lombok.Data;

@Data
public class RoomPayload {
    private String id;
    private int playersCount;
    private int maxPlayers;
    private int timeLeft;

    // Constructors
    public RoomPayload(String id, int playersCount, int maxPlayers, int timeLeft) {
        this.id = id;
        this.playersCount = playersCount;
        this.maxPlayers = maxPlayers;
        this.timeLeft = timeLeft;
    }

}