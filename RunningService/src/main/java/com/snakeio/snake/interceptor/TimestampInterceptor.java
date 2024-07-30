package com.snakeio.snake.interceptor;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.support.ChannelInterceptor;

public class TimestampInterceptor implements ChannelInterceptor {

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        // 从消息中获取时间戳和其他必要的元数据
        Long timestamp = (Long) message.getHeaders().get("timestamp");
        // 假设有一个方法来获取最新的有效时间戳
        Long latestTimestamp = getLatestTimestamp();

        if (timestamp != null && latestTimestamp != null && timestamp < latestTimestamp) {
            // 丢弃过时的消息
            return null;
        }
        return message;
    }

    private Long getLatestTimestamp() {
        // 实现获取最新有效时间戳的逻辑
        // 可以存储在内存、数据库或其他地方
        return System.currentTimeMillis(); // 示例：当前时间戳
    }
}
