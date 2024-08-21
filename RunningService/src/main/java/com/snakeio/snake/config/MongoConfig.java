package com.snakeio.snake.config;

import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;

@Configuration
public class MongoConfig {

    @Bean
    public MongoTemplate mongoTemplate() {
        // 创建 MongoClientSettings 配置
        MongoClientSettings settings = MongoClientSettings.builder()
                .applyConnectionString(new com.mongodb.ConnectionString("mongodb://localhost:27017/snake_game?connectTimeoutMS=30000&socketTimeoutMS=30000"))
                .applyToConnectionPoolSettings(builder ->
                        builder
                                .maxSize(8000)  // 设置最大连接数
                                .minSize(1000)   // 设置最小连接数
                )
                .build();

        // 使用 MongoClientSettings 创建 MongoClient
        MongoClient mongoClient = MongoClients.create(settings);

        // 创建 SimpleMongoClientDatabaseFactory 使用自定义 MongoClient
        return new MongoTemplate(new SimpleMongoClientDatabaseFactory(mongoClient, "snake_game"));
    }
}
