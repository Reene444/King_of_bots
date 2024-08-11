package com.snakeio.snake.config;

import jakarta.annotation.PreDestroy;
import org.springframework.stereotype.Component;


import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class DirectoryCleanup {

    private static final String RECORDINGS_PATH = "RecordingService/src/main/resources/static/recordings";

    @PreDestroy
    public void cleanup() {
        try {
            deleteDirectory(Paths.get(RECORDINGS_PATH));
            System.out.println("Recordings folder deleted successfully.");
        } catch (IOException e) {
            System.err.println("Failed to delete recordings folder: " + e.getMessage());
        }
    }

    private void deleteDirectory(Path path) throws IOException {
        if (Files.exists(path)) {
            Files.walk(path)
                    .map(Path::toFile)
                    .forEach(File::delete);
            Files.deleteIfExists(path);
        }
    }
}
