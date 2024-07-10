package com.InstaCut.demo.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = {"*"},maxAge=3600)
public class HomeController {


    @GetMapping("/")
    public String demo(){
        return "Hello World this is Reene" ;
    }

    @GetMapping("/test")
    @Tag(name="Test",description = "The Test API.")
    @SecurityRequirement(name="rest-test1-api")
    public String test(){
        return "TEST Api" ;
    }
}


