package com.snakeio.snake.config;

import org.apache.camel.builder.RouteBuilder;
import org.springframework.stereotype.Component;

import org.apache.camel.builder.RouteBuilder;
import org.springframework.stereotype.Component;

@Component
public class StompToKafkaRoute extends RouteBuilder {

    @Override
    public void configure() throws Exception {
        // WebSocket Route for adding a player
        from("websocket://0.0.0.0:8097/game?subprotocol=stomp")
            .routeId("game-websocket-route")
            .choice()
                // Subscribe to add player events
                .when(header("destination").regex("/app/game\\.(.*)\\.add"))
                    .to("direct:addPlayer")
                // Subscribe to move player events
                .when(header("destination").regex("/app/game\\.(.*)\\.move"))
                    .to("direct:movePlayer")
                // Subscribe to remove player events
                .when(header("destination").regex("/app/game\\.(.*)\\.removePlayer"))
                    .to("direct:removePlayer")
            .end();

        // Add player to Kafka topic
        from("direct:addPlayer")
            .process(exchange -> {
                String roomId = exchange.getIn().getHeader("destination", String.class).split("\\.")[1];
                exchange.getIn().setHeader("roomId", roomId);
            })
            .to("kafka:player-add?brokers=localhost:9092");

        // Move player and send update to Kafka topic
        from("direct:movePlayer")
            .process(exchange -> {
                String roomId = exchange.getIn().getHeader("destination", String.class).split("\\.")[1];
                exchange.getIn().setHeader("roomId", roomId);
            })
            .to("kafka:player-move?brokers=localhost:9092");

        // Remove player from Kafka topic
        from("direct:removePlayer")
            .process(exchange -> {
                String roomId = exchange.getIn().getHeader("destination", String.class).split("\\.")[1];
                exchange.getIn().setHeader("roomId", roomId);
            })
            .to("kafka:player-remove?brokers=localhost:9092");

        // Consume Kafka messages and send them back to WebSocket
        from("kafka:player-add?brokers=localhost:9092")
            .process(exchange -> {
                String roomId = exchange.getIn().getHeader("roomId", String.class);
                exchange.getIn().setHeader("destination", "/topic/game." + roomId + ".add");
            })
            .to("websocket://0.0.0.0:8097/game?sendToAll=false");

        from("kafka:player-move?brokers=localhost:9092")
            .process(exchange -> {
                String roomId = exchange.getIn().getHeader("roomId", String.class);
                exchange.getIn().setHeader("destination", "/topic/game." + roomId + ".move");
            })
            .to("websocket://0.0.0.0:8097/game?sendToAll=false");

        from("kafka:player-remove?brokers=localhost:9092")
            .process(exchange -> {
                String roomId = exchange.getIn().getHeader("roomId", String.class);
                exchange.getIn().setHeader("destination", "/topic/game." + roomId + ".remove");
            })
            .to("websocket://0.0.0.0:8097/game?sendToAll=false");
    }
}
