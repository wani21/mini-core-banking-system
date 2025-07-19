package com.corebanking.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuator.health.Health;
import org.springframework.boot.actuator.health.HealthIndicator;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Service
public class HealthMonitoringService implements HealthIndicator {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public Health health() {
        try {
            return checkDatabaseHealth();
        } catch (Exception e) {
            return Health.down()
                    .withDetail("error", e.getMessage())
                    .build();
        }
    }

    private Health checkDatabaseHealth() {
        try {
            // Test database connectivity
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            
            if (result != null && result == 1) {
                Map<String, Object> details = new HashMap<>();
                details.put("database", "MySQL");
                details.put("status", "Connected");
                details.put("connection_pool", "Active");
                
                return Health.up()
                        .withDetails(details)
                        .build();
            } else {
                return Health.down()
                        .withDetail("database", "Connection test failed")
                        .build();
            }
        } catch (Exception e) {
            return Health.down()
                    .withDetail("database", "Connection failed: " + e.getMessage())
                    .build();
        }
    }

    public Map<String, Object> getSystemMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        
        // Runtime metrics
        Runtime runtime = Runtime.getRuntime();
        long totalMemory = runtime.totalMemory();
        long freeMemory = runtime.freeMemory();
        long usedMemory = totalMemory - freeMemory;
        
        metrics.put("memory_total_mb", totalMemory / (1024 * 1024));
        metrics.put("memory_used_mb", usedMemory / (1024 * 1024));
        metrics.put("memory_free_mb", freeMemory / (1024 * 1024));
        metrics.put("memory_usage_percent", (double) usedMemory / totalMemory * 100);
        
        // Database metrics
        try {
            Integer userCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users", Integer.class);
            Integer accountCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM accounts", Integer.class);
            Integer transactionCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM transactions", Integer.class);
            
            metrics.put("total_users", userCount);
            metrics.put("total_accounts", accountCount);
            metrics.put("total_transactions", transactionCount);
        } catch (Exception e) {
            metrics.put("database_metrics_error", e.getMessage());
        }
        
        return metrics;
    }
}