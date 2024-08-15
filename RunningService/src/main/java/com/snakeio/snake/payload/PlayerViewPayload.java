package com.snakeio.snake.payload;

import com.snakeio.snake.model.Player;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class PlayerViewPayload {
    private String id;
    private String nickname;
    private String ISOcode;
    private int score;
}
