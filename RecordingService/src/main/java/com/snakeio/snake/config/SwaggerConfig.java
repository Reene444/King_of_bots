package com.snakeio.snake.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info =@Info(
                title = "Demo API",
                version = "Verions 1.0",
                contact = @Contact(
                        name = "album-system-api", email = "reene44444@gmail.com", url = "https://github.com/Reene444"
                ),
                license = @License(
                        name = "Apache 2.0", url = "https://www.apache.org/licenses/LICENSE-2.0"
                ),
                termsOfService = "https://github.com/Reene444",
                description = "Spring Boot RestFul AlbumSystem API Demo by Reene"
        )
)
public class SwaggerConfig {
}
