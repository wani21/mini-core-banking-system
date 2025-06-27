
package com.corebanking.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/public")
public class PublicController {

    @GetMapping("/health")
    public String health() {
        return "Core Banking System is running!";
    }

    @GetMapping("/version")
    public String version() {
        return "Core Banking System v1.0.0";
    }
}
