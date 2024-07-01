package com.snakeio.snake.config;

import com.snakeio.snake.model.Player;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

//@Configuration
public class SeedData {

//    @Bean
    public List<Player> initialPlayers() {
        List<Player> players = new ArrayList<>();

        Player initialPlayer = new Player();
        initialPlayer.setId(UUID.randomUUID().toString());
        initialPlayer.setColor("red");
//        initialPlayer.setUsername("admin");
//        initialPlayer.setNickname("Champion");
//        initialPlayer.setScore(99999);
        initialPlayer.setSegments(generateInitialSegments());
        players.add(initialPlayer);

        // Add more initial players if needed
        return players;
    }

    private List<Player.Segment> generateInitialSegments() {
        List<Player.Segment> segments = new ArrayList<>();
        int startX = 100;
        int startY = 100;
        for (int i = 0; i < 5; i++) {
            Player.Segment segment = new Player.Segment();
            segment.setX(startX - i * 10);
            segment.setY(startY);
            segments.add(segment);
        }
        return segments;
    }
}
