package com.corebanking.controller;

import com.corebanking.entity.FixedDeposit;
import com.corebanking.service.FixedDepositService;
import com.corebanking.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/fixed-deposit")
@CrossOrigin(origins = "*")
public class FixedDepositController {

    @Autowired
    private FixedDepositService fixedDepositService;

    @Autowired
    private CustomerService customerService;

    @PostMapping("/create")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> createFixedDeposit(@RequestBody CreateFDRequest request, Authentication authentication) {
        try {
            String username = authentication.getName();
            Long customerId = customerService.getCustomerByUsername(username).getCustomerId();
            
            FixedDeposit fd = fixedDepositService.createFixedDeposit(
                request.getAccountId(), 
                request.getAmount(), 
                request.getTenureMonths()
            );
            return ResponseEntity.ok(fd);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create Fixed Deposit: " + e.getMessage());
        }
    }

    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<?> getCustomerFixedDeposits(@PathVariable Long customerId) {
        try {
            List<FixedDeposit> fds = fixedDepositService.getFixedDepositsByCustomer(customerId);
            return ResponseEntity.ok(fds);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get Fixed Deposits: " + e.getMessage());
        }
    }

    @PostMapping("/mature/{fdId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> matureFixedDeposit(@PathVariable Long fdId) {
        try {
            FixedDeposit fd = fixedDepositService.matureFixedDeposit(fdId);
            return ResponseEntity.ok(fd);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to mature Fixed Deposit: " + e.getMessage());
        }
    }

    @PostMapping("/close/{fdId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> closePrematurelyFixedDeposit(@PathVariable Long fdId, Authentication authentication) {
        try {
            String username = authentication.getName();
            Long customerId = customerService.getCustomerByUsername(username).getCustomerId();
            
            FixedDeposit fd = fixedDepositService.closePrematurelyFixedDeposit(fdId);
            return ResponseEntity.ok(fd);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to close Fixed Deposit: " + e.getMessage());
        }
    }

    public static class CreateFDRequest {
        private Long accountId;
        private BigDecimal amount;
        private Integer tenureMonths;

        // Getters and setters
        public Long getAccountId() { return accountId; }
        public void setAccountId(Long accountId) { this.accountId = accountId; }
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        public Integer getTenureMonths() { return tenureMonths; }
        public void setTenureMonths(Integer tenureMonths) { this.tenureMonths = tenureMonths; }
    }
}