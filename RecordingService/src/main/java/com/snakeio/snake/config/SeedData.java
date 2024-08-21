package com.snakeio.snake.config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.snakeio.snake.service.RecordingService;

@Component
public class SeedData implements CommandLineRunner {

    
    @Autowired
    private RecordingService recordingService;    @Override
    public void run(String... args) throws Exception {
              //  recordingService.saveRecording(new Recording());
      }
    }