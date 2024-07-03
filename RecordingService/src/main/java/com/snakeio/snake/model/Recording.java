package com.snakeio.snake.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "recordings")
public class Recording {
    @Id
    private String id;
    private String playerId;
    private List<Action> actions;

    // Getters and Setters
}