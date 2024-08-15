package com.snakeio.snake.payload;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ProfileDTO {
    private long id;
    private String email;
    private String authorities;
}
