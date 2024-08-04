package com.snakeio.snake.repository;

import com.snakeio.snake.model.Recording;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecordingRepository extends MongoRepository<Recording, String> {
    List<Recording> findByUserId(String userId);
}