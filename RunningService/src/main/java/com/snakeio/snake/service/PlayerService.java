package com.snakeio.snake.service;

import com.snakeio.snake.model.Player;
import com.snakeio.snake.repository.PlayerRepository;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PlayerService {
    @Autowired
    private PlayerRepository playerRepository;

    public Player savePlayer(Player player){
        return playerRepository.save(player);
    }
}
