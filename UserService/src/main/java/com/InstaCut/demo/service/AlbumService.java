package com.InstaCut.demo.service;

import com.InstaCut.demo.model.Album;
import com.InstaCut.demo.repository.AlbumRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AlbumService {

    @Autowired
    private AlbumRepository albumRepository;

    public Album save(Album album){
        return albumRepository.save(album);
    }

    public List<Album>findByAccount_id(long id){
        return albumRepository.findByAccount_Id(id);
    }

    public Optional<Album>findById(long id){
        return albumRepository.findById(id);
    }

    public void deleteAlbum(Album album){
        albumRepository.delete(album);
    }
}

