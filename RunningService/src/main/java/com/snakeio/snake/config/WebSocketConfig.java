package com.snakeio.snake.config;

import com.snakeio.snake.interceptor.TimestampInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
//
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig  implements WebSocketMessageBrokerConfigurer{

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS()
                .setWebSocketEnabled(true);
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app");
        //configure use simplebroker by springboot: there is enough for our application
        registry.enableSimpleBroker("/topic");

        // This is optimization: Configure RabbitMQ as message broker
//        registry.enableStompBrokerRelay("/topic", "/queue")
//                .setRelayHost("localhost")
//                .setRelayPort(61613)
//                .setClientLogin("guest")
//                .setClientPasscode("guest")
//                .setVirtualHost("/")
//                .setSystemLogin("root")
//                .setSystemPasscode("123456");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new TimestampInterceptor());
    }
//    @KafkaListener(topics = "game-room", groupId = "group_id")
//    public void listen(String message) {
//        // Parse the message to determine the room and the action
//        String[] parts = message.split(":", 3);
//        String roomId = parts[0];
//        String action = parts[1];
//        String playerData = parts[2];
//
//        // Send message to WebSocket clients
//        messagingTemplate.convertAndSend("/topic/game/" + roomId + "/" + action, playerData);
//    }
}