package com.InstaCut.demo.service;

import com.InstaCut.demo.model.Photo;
import com.InstaCut.demo.repository.PhotoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PhotoService {
    @Autowired
    private PhotoRepository photoRepository;

    public Photo save(Photo photo) {
        return photoRepository.save(photo);
    }

    public Optional<Photo> findById(long photo_id){
        return photoRepository.findById(photo_id);
    }
    public void delete(Photo photo){
        photoRepository.delete(photo);
    }
    public List<Photo> findByAlbumId(long id){
        return photoRepository.findByAlbum_Id(id);
    }
}