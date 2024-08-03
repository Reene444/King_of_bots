package com.snakeio.snake;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootTest
@EnableMongoRepositories(basePackages = "com.snakeio.snake.repository")
class RunningServerApplicationTests {

    @Test
    void contextLoads() {
    }

}
