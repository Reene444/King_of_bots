package com.InstaCut.demo;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
@SecurityScheme(name = "album-system-api",scheme = "bearer",type= SecuritySchemeType.HTTP, in = SecuritySchemeIn.HEADER)
public class InstaCutApplication {

    public static void main(String[] args) {
        SpringApplication.run(InstaCutApplication.class, args);
    }

}
