package com.snakeio.snake.config;

import jakarta.annotation.PostConstruct;
import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.codec.JsonJacksonCodec;
import org.redisson.config.Config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;

@Configuration
public class RedissonConfig {

    @Bean
    public RedissonClient redissonClient() {
        Config config = new Config();
        config.useSingleServer().setAddress("redis://127.0.0.1:6379"); // 配置 Redis 地址
        // 使用 JSON 编码器
        config.setCodec(new JsonJacksonCodec());

        return Redisson.create(config);
    }

}