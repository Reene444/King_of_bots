package com.InstaCut.demo.payload.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.Size;

@Getter
@Setter
public class UserLoginDTO {
    @Email
    @Schema(description = "Email address", example = "user@user.com",requiredMode = Schema.RequiredMode.REQUIRED)
    private String email;
    @Size(min=6, max=20)

    @Schema(description = "Password", example = "pass987",
            requiredMode = Schema.RequiredMode.REQUIRED,maxLength = 20,minLength = 6)
    private String password;
}
