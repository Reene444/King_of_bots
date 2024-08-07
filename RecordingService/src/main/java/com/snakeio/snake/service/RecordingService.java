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
        // 创建文件名
        String originalFilename = file.getOriginalFilename();
        assert originalFilename != null;
        String userId = originalFilename.split("_")[0];
        String startTime = originalFilename.split("_")[1].replace(".txt", "");

        String filePath = UPLOAD_DIR + originalFilename;

        // 确保目录存在
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }
        System.out.println("保存文件的路径是: " + Paths.get(filePath).toAbsolutePath().toString());
        // 保存文件到目录
        Files.copy(file.getInputStream(), Paths.get(filePath));
//        AppUtil.get_photo_upload_path(originalFilename,"recordings",userId);
        // 创建 Recording 对象并保存到数据库
        Recording recording = new Recording();
        recording.setUserId(userId);
        recording.setFileName(originalFilename);
        recording.setFilePath(filePath);
        recording.setContentType(file.getContentType());
        recording.setStartTime(startTime);
        recording.setDuration("");  // 可选字段，之后可以更新
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
