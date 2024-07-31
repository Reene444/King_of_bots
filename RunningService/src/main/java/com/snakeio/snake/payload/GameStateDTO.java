package com.snakeio.snake.payload;


import com.snakeio.snake.model.Player;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
@Getter
@Setter
public class GameStateDTO {
    private List<Player> players;

    public GameStateDTO(List<Player> players) {
        this.players = players;
    }
}
