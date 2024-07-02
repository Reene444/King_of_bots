package com.snakeio.snake.controller;

import com.snakeio.snake.model.Recording;
import com.snakeio.snake.service.RecordingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recordings")
@CrossOrigin(origins = "*") // 前端运行的地址
public class RecordingController {

    @Autowired
    private RecordingService recordingService;

    @PostMapping
    public Recording saveRecording(@RequestBody Recording recording) {
        System.out.println("save recording"+recording);
        return recordingService.saveRecording(recording);
    }

    @GetMapping
    public List<Recording> getAllRecordings() {
        return recordingService.getAllRecordings();
    }

    @GetMapping("/{id}")
    public Recording getRecordingById(@PathVariable Long id) {
        return recordingService.getRecordingById(id).orElse(null);
    }
}
