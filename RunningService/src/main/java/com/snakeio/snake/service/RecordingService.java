package com.snakeio.snake.service;

import com.snakeio.snake.model.Recording;
import com.snakeio.snake.repository.RecordingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RecordingService {

    @Autowired
    private RecordingRepository recordingRepository;

    public Recording saveRecording(Recording recording) {
        return recordingRepository.save(recording);
    }

    public List<Recording> getAllRecordings() {
        return recordingRepository.findAll();
    }

    public Optional<Recording> getRecordingById(Long id) {
        return recordingRepository.findById(id);
    }
}
