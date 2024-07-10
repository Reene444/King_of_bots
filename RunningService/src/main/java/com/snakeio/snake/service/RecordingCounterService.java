package com.snakeio.snake.service;


import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicInteger;

@Service
public class RecordingCounterService {

    private final AtomicInteger recordingCounter = new AtomicInteger(0);

    public int increment() {
        return recordingCounter.incrementAndGet();
    }

    public int decrement() {
        return recordingCounter.decrementAndGet();
    }

    public int getCount() {
        return recordingCounter.get();
    }
}
