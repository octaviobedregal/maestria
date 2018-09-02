package com.firstalert;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class FirstalertApplication {

    public static void main(String[] args) {
        SpringApplication.run(FirstalertApplication.class, args);
    }

    @RequestMapping("/api/usuarios")
    public String saludar() {
        return "hOLA";
    }
}
