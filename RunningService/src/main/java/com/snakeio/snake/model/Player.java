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
    private int score; // 新增score字段
    private List<Segment> segments;
    private String nickname;

    private String type; // 新增type字段，用于区分Snake和Mouse
    @Data
    @Getter
    @Setter
    public static class Segment {
        private int x;
        private int y;
    }
}
