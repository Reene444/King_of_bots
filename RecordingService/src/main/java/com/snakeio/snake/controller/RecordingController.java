package com.snakeio.snake.controller;

import com.snakeio.snake.model.Recording;
import com.snakeio.snake.payload.RecordingViewDTO;
import com.snakeio.snake.service.RecordingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/recordings")
@CrossOrigin(origins = "*") // 前端运行的地址
public class RecordingController {
    @Autowired
    private RecordingService recordingService;

    @PostMapping("/upload")
    public Recording saveRecording(@RequestParam("file") MultipartFile file) {
        System.out.println("receive the file save request"+file.getOriginalFilename()+file.toString());

        try {
            return recordingService.saveRecording(file);
        } catch (IOException e) {
            throw new RuntimeException("Failed to save recording", e);
        }

    }

    @GetMapping
    public List<Recording> getAllRecordings() {
        return recordingService.getAllRecordings();
    }

    @GetMapping("/list/{userId}")
    public ResponseEntity<List<RecordingViewDTO>> getRecordingByUserId(@PathVariable String userId) {
        System.out.println("receive the content id");
        try {
            List<RecordingViewDTO> recordings = recordingService.getRecordingByUserId(userId);
            if (!recordings.isEmpty()) {
                return ResponseEntity.ok(recordings);
            } else {
                return ResponseEntity.ok(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @GetMapping("/content/{id}")
    public ResponseEntity<String> getRecordingFileContentById(@PathVariable String id) {
        System.out.println("receive the content id");
        try {
            String content = recordingService.getRecordingFileContentById(id);
            if (content != null) {
                return ResponseEntity.ok(content);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }
    @DeleteMapping("/{id}")
    public void deleteRecordingById(@PathVariable String id) {
        recordingService.deleteRecordingById(id);
    }
}
