package com.InstaCut.demo.payload.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Size;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PasswordDTO {

    @Size(min=6,max=20)
    @Schema(description = "Password",example = "password",
    requiredMode = Schema.RequiredMode.REQUIRED,maxLength = 20,minLength = 6)
    private String password;
}
