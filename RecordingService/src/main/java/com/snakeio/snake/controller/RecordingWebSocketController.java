package com.snakeio.snake.controller;

import lombok.Getter;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;


@Controller
@CrossOrigin
public class RecordingWebSocketController {

    private boolean recording = false;

    @MessageMapping("/game.startRecording")
    @SendTo("/topic/recording")
    public boolean startRecording() {
        recording = true;
        return recording;
    }

    @MessageMapping("/game.stopRecording")
    @SendTo("/topic/recording")
    public boolean stopRecording() {
        recording = false;
        return recording;
    }

}
