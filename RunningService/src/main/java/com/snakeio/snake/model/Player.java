package com.snakeio.snake.model;

import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
@Document(collection = "players")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Player {
    @Id
    private String id;
    private int x;
    private int y;
    private String color;
    private int score; // 新增score字段
    private List<Segment> segments;
    private String nickname;
    private String type; // 新增type字段，用于区分Snake和Mouse
    private String ISOcode="UK";
    private String roomId; // 关联的房间 ID
    private long lastUpdateTime;
    @Data
    @Getter
    @Setter
    public static class Segment {
        private int x;
        private int y;
    }
}
