package com.InstaCut.demo.payload.album;

import lombok.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class PhotoDTO {
    private long id;
    private String name;
    private String description;

    private String fileName;

    private String download_link;

}
