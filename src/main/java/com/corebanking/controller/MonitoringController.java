package com.corebanking.controller;

import com.corebanking.service.HealthMonitoringService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/monitoring")
public class MonitoringController {

    @Autowired
    private HealthMonitoringService healthMonitoringService;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getSystemStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("service", "Core Banking System");
        status.put("status", "UP");
        status.put("timestamp", LocalDateTime.now());
        status.put("version", "1.0.0");
        return ResponseEntity.ok(status);
    }

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getSystemMetrics() {
        return ResponseEntity.ok(healthMonitoringService.getSystemMetrics());
    }

    @GetMapping("/health-check")
    public ResponseEntity<Map<String, Object>> performHealthCheck() {
        Map<String, Object> healthCheck = new HashMap<>();
        healthCheck.put("timestamp", LocalDateTime.now());
        healthCheck.put("health", healthMonitoringService.health());
        healthCheck.put("metrics", healthMonitoringService.getSystemMetrics());
        return ResponseEntity.ok(healthCheck);
    }
}