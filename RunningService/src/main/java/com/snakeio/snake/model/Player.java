package com.snakeio.snake.model;

import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Objects;

@Document(collection = "players")
//@Data
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
//    @Data
    @Getter
    @Setter
    public static class Segment {
        private int x;
        private int y;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true; // 如果两个对象是同一个实例
        if (obj == null || getClass() != obj.getClass()) return false; // 检查类型和非空
        Player player = (Player) obj;
        return id.equals(player.id); // 根据唯一标识符进行比较
    }

    @Override
    public int hashCode() {
        return Objects.hash(id); // 计算基于唯一标识符的哈希码
    }
}
