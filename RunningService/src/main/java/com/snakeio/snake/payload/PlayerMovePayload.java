package com.snakeio.snake.payload;

import com.snakeio.snake.model.Player;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class PlayerMovePayload {
    private String id;
    private Player.Segment head;
    private long timestamp;  // 添加时间戳字段

}
