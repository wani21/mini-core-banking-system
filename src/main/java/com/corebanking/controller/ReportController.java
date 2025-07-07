
package com.corebanking.controller;

import com.corebanking.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/dashboard-stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getDashboardStats() {
        try {
            Map<String, Object> stats = reportService.getDashboardStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get dashboard stats: " + e.getMessage());
        }
    }

    @GetMapping("/transaction-stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getTransactionStats(@RequestParam String startDate, @RequestParam String endDate) {
        try {
            LocalDateTime start = LocalDateTime.parse(startDate + "T00:00:00");
            LocalDateTime end = LocalDateTime.parse(endDate + "T23:59:59");
            Map<String, Object> stats = reportService.getTransactionStats(start, end);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get transaction stats: " + e.getMessage());
        }
    }

    @GetMapping("/monthly-summary")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getMonthlySummary(@RequestParam int year, @RequestParam int month) {
        try {
            Map<String, ?> summary = reportService.getMonthlyTransactionSummary(year, month);
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get monthly summary: " + e.getMessage());
        }
    }
}
