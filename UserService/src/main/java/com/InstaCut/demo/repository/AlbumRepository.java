package com.InstaCut.demo.repository;

import com.InstaCut.demo.model.Album;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlbumRepository extends JpaRepository<Album,Long> {
    List<Album>findByAccount_Id(long id);

}
