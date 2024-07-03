package com.snakeio.snake.repository;

import com.snakeio.snake.model.Recording;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecordingRepository extends MongoRepository<Recording, String> {
}