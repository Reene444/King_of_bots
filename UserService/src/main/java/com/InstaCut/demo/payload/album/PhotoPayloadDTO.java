package com.InstaCut.demo.payload.album;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import javax.validation.constraints.NotBlank;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PhotoPayloadDTO {
    @NotBlank
    @Schema(description = "Photo name",example = "Travel",requiredMode = Schema.RequiredMode.REQUIRED)
    private String name;

    @NotBlank
    @Schema(description = "Description of the photo",example = "Description",requiredMode = Schema.RequiredMode.REQUIRED)
    private String description;

}
