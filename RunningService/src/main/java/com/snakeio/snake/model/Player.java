package com.snakeio.snake.model;

import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Player {
    private String id;
    private int x;
    private int y;
    private String color;
    private int score=10; // 新增score字段
    private List<Segment> segments;

    @Data
    @Getter
    @Setter
    public static class Segment {
        private int x;
        private int y;
    }
}
