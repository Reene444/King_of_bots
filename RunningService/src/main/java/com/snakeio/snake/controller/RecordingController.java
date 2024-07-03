package com.snakeio.snake.controller;

import com.snakeio.snake.model.Recording;
import com.snakeio.snake.service.RecordingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/recordings")
@CrossOrigin(origins = "*") // 前端运行的地址
public class RecordingController {
    @Autowired
    private RecordingService recordingService;

    @PostMapping
    public Recording saveRecording(@RequestBody Recording recording) {
        return recordingService.saveRecording(recording);
    }

    @GetMapping
    public List<Recording> getAllRecordings() {
        return recordingService.getAllRecordings();
    }

    @GetMapping("/{id}")
    public Optional<Recording> getRecordingById(@PathVariable String id) {
        return recordingService.getRecordingById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteRecordingById(@PathVariable String id) {
        recordingService.deleteRecordingById(id);
    }
}