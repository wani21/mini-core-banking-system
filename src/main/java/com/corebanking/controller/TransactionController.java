
package com.corebanking.controller;

import com.corebanking.dto.TransactionRequest;
import com.corebanking.entity.Account;
import com.corebanking.entity.Customer;
import com.corebanking.entity.Transaction;
import com.corebanking.entity.User;
import com.corebanking.service.AccountService;
import com.corebanking.service.CustomerService;
import com.corebanking.service.TransactionService;
import com.corebanking.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/transaction")
@CrossOrigin(origins = "*")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private UserService userService;

    @PostMapping("/deposit")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> deposit(@Valid @RequestBody TransactionRequest request, Authentication authentication) {
        try {
            // Verify account ownership
            if (!verifyAccountOwnership(request.getAccountNumber(), authentication)) {
                return ResponseEntity.badRequest().body("Account access denied");
            }
            
            Transaction transaction = transactionService.deposit(request.getAccountNumber(), request.getAmount(), request.getDescription());
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Deposit failed: " + e.getMessage());
        }
    }

    @PostMapping("/withdraw")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> withdraw(@Valid @RequestBody TransactionRequest request, Authentication authentication) {
        try {
            // Verify account ownership
            if (!verifyAccountOwnership(request.getAccountNumber(), authentication)) {
                return ResponseEntity.badRequest().body("Account access denied");
            }
            
            Transaction transaction = transactionService.withdraw(request.getAccountNumber(), request.getAmount(), request.getDescription());
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Withdrawal failed: " + e.getMessage());
        }
    }

    @PostMapping("/transfer")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> transfer(@Valid @RequestBody TransactionRequest request, Authentication authentication) {
        try {
            // Verify source account ownership
            if (!verifyAccountOwnership(request.getAccountNumber(), authentication)) {
                return ResponseEntity.badRequest().body("Source account access denied");
            }
            
            transactionService.transfer(request.getAccountNumber(), request.getToAccountNumber(), request.getAmount(), request.getDescription());
            return ResponseEntity.ok("Transfer completed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Transfer failed: " + e.getMessage());
        }
    }

    @GetMapping("/account/{accountNumber}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> getAccountTransactions(@PathVariable String accountNumber,
                                                   @RequestParam(defaultValue = "0") int page,
                                                   @RequestParam(defaultValue = "10") int size,
                                                   Authentication authentication) {
        try {
            // Verify account ownership
            if (!verifyAccountOwnership(accountNumber, authentication)) {
                return ResponseEntity.badRequest().body("Account access denied");
            }
            
            Optional<Account> accountOptional = accountService.getAccountByNumber(accountNumber);
            if (accountOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("Account not found");
            }
            
            Pageable pageable = PageRequest.of(page, size);
            Page<Transaction> transactions = transactionService.getAccountTransactions(accountOptional.get().getAccountId(), pageable);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get transactions: " + e.getMessage());
        }
    }

    private boolean verifyAccountOwnership(String accountNumber, Authentication authentication) {
        try {
            String username = authentication.getName();
            Optional<User> userOptional = userService.findByUsername(username);
            
            if (userOptional.isEmpty()) {
                return false;
            }
            
            Optional<Customer> customerOptional = customerService.findByUserId(userOptional.get().getUserId());
            
            if (customerOptional.isEmpty()) {
                return false;
            }
            
            Optional<Account> accountOptional = accountService.getAccountByNumber(accountNumber);
            
            if (accountOptional.isEmpty()) {
                return false;
            }
            
            return accountOptional.get().getCustomer().getCustomerId().equals(customerOptional.get().getCustomerId());
        } catch (Exception e) {
            return false;
        }
    }
}
