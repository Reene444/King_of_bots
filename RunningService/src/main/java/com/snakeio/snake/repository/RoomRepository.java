package com.snakeio.snake.repository;

import com.snakeio.snake.model.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RoomRepository extends MongoRepository<Room, String> {
    // 自定义查询方法
    Optional<Room> findById(String id);
}
