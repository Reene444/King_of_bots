package com.snakeio.snake.service;

import com.snakeio.snake.model.Recording;
import com.snakeio.snake.payload.RecordingViewDTO;
import com.snakeio.snake.repository.RecordingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RecordingService {

    @Autowired
    private RecordingRepository recordingRepository;

    private static final String UPLOAD_DIR = "RecordingService/src/main/resources/static/recordings/";

    public Recording saveRecording(MultipartFile file) throws IOException {
        // create file name
        String originalFilename = file.getOriginalFilename();
        assert originalFilename != null;
        String userId = originalFilename.split("_")[0];
        String startTime = originalFilename.split("_")[1].replace(".txt", "");

        String filePath = UPLOAD_DIR + originalFilename;

        // ensure the directory is existed
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }
        // Save the file to the directory
        Files.copy(file.getInputStream(), Paths.get(filePath));
        // Create a Recording object and save it to the database
        Recording recording = new Recording();
        recording.setUserId(userId);
        recording.setFileName(originalFilename);
        recording.setFilePath(filePath);
        recording.setContentType(file.getContentType());
        recording.setStartTime(startTime);
        recording.setDuration("");  // Optional field, can be updated later
        return recordingRepository.save(recording);
    }

    public List<Recording> getAllRecordings() {
        return recordingRepository.findAll();
    }

    public List<RecordingViewDTO> getRecordingByUserId(String userId) {
        List<Recording> recordings = recordingRepository.findByUserId(userId);
        return recordings.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private RecordingViewDTO convertToDTO(Recording recording) {
        RecordingViewDTO dto = new RecordingViewDTO();
        dto.setId(recording.getId());
        dto.setName(recording.getFileName()); // Assuming name is the fileName
        dto.setUserId(recording.getUserId());
        dto.setStartTime(recording.getStartTime());
        return dto;
    }

    public String getRecordingFileContentById(String id) throws IOException {
        Optional<Recording> optionalRecording = recordingRepository.findById(id);
        System.out.println("recoding:"+optionalRecording.toString());
        if (optionalRecording.isPresent()) {
            Recording recording = optionalRecording.get();
            String filePath = recording.getFilePath();
            return new String(Files.readAllBytes(Paths.get(filePath)));
        }
        return null;
    }
    public void deleteRecordingById(String id) {
        recordingRepository.deleteById(id);
    }
}
