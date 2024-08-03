package com.snakeio.snake.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "recordings")
public class Recording {
    @Id
    private String id;
    private String userId;
    private String fileName;
    private String filePath;
    private String contentType;
    private String startTime;
    private String duration;

    // Getters and Setters
}
