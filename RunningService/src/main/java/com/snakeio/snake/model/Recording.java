package com.snakeio.snake.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Recording {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String playerId;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Action> actions;

    // Getters and setters
}
