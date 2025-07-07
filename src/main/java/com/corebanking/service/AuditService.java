
package com.corebanking.service;

import com.corebanking.entity.AuditLog;
import com.corebanking.entity.AuditSeverity;
import com.corebanking.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class AuditService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    public void logAction(String username, String action, String resource) {
        logAction(username, action, resource, null, null, AuditSeverity.INFO);
    }

    public void logAction(String username, String action, String resource, String oldValues, String newValues) {
        logAction(username, action, resource, oldValues, newValues, AuditSeverity.INFO);
    }

    public void logAction(String username, String action, String resource, String oldValues, String newValues, AuditSeverity severity) {
        AuditLog auditLog = new AuditLog(username, action, resource);
        auditLog.setOldValues(oldValues);
        auditLog.setNewValues(newValues);
        auditLog.setSeverity(severity);
        auditLogRepository.save(auditLog);
    }

    public Page<AuditLog> getAuditLogsByUser(String username, Pageable pageable) {
        return auditLogRepository.findByUsernameOrderByTimestampDesc(username, pageable);
    }

    public Page<AuditLog> getAuditLogsByAction(String action, Pageable pageable) {
        return auditLogRepository.findByActionOrderByTimestampDesc(action, pageable);
    }

    public List<AuditLog> getAuditLogsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return auditLogRepository.findByTimestampBetween(startDate, endDate);
    }

    public List<AuditLog> getCriticalAuditLogs() {
        return auditLogRepository.findBySeverity(AuditSeverity.CRITICAL);
    }
}
