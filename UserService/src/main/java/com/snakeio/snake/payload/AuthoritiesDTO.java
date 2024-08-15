package com.snakeio.snake.payload;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter

public class AuthoritiesDTO {

    @NotBlank
    @Schema(description = "Authorities",example = "USER",
    requiredMode = Schema.RequiredMode.REQUIRED)
    private String authorities;
}
