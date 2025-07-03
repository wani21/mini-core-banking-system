
package com.corebanking.controller;

import com.corebanking.dto.AccountCreateRequest;
import com.corebanking.entity.Account;
import com.corebanking.entity.AccountStatus;
import com.corebanking.entity.Customer;
import com.corebanking.entity.User;
import com.corebanking.service.AccountService;
import com.corebanking.service.CustomerService;
import com.corebanking.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/account")
@CrossOrigin(origins = "*")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private UserService userService;

    @PostMapping("/create")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> createAccount(@Valid @RequestBody AccountCreateRequest request, 
                                         Authentication authentication) {
        try {
            String username = authentication.getName();
            Optional<User> userOptional = userService.findByUsername(username);
            
            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            Optional<Customer> customerOptional = customerService.findByUserId(userOptional.get().getUserId());
            
            if (customerOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("Customer profile not found");
            }
            
            Account account = accountService.createAccount(customerOptional.get().getCustomerId(), request.getAccountType());
            return ResponseEntity.ok(account);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Account creation failed: " + e.getMessage());
        }
    }

    @GetMapping("/my-accounts")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> getMyAccounts(Authentication authentication) {
        try {
            String username = authentication.getName();
            Optional<User> userOptional = userService.findByUsername(username);
            
            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            Optional<Customer> customerOptional = customerService.findByUserId(userOptional.get().getUserId());
            
            if (customerOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("Customer profile not found");
            }
            
            List<Account> accounts = accountService.getCustomerAccounts(customerOptional.get().getCustomerId());
            return ResponseEntity.ok(accounts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get accounts: " + e.getMessage());
        }
    }

    @GetMapping("/{accountNumber}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> getAccountByNumber(@PathVariable String accountNumber, Authentication authentication) {
        try {
            Optional<Account> accountOptional = accountService.getAccountByNumber(accountNumber);
            
            if (accountOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("Account not found");
            }
            
            // Verify the account belongs to the authenticated user
            String username = authentication.getName();
            Optional<User> userOptional = userService.findByUsername(username);
            
            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            Optional<Customer> customerOptional = customerService.findByUserId(userOptional.get().getUserId());
            
            if (customerOptional.isEmpty() || 
                !accountOptional.get().getCustomer().getCustomerId().equals(customerOptional.get().getCustomerId())) {
                return ResponseEntity.badRequest().body("Account access denied");
            }
            
            return ResponseEntity.ok(accountOptional.get());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get account: " + e.getMessage());
        }
    }

    @PutMapping("/{accountId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateAccountStatus(@PathVariable Long accountId, @RequestBody AccountStatus status) {
        try {
            Account account = accountService.updateAccountStatus(accountId, status);
            return ResponseEntity.ok("Account status updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update account status: " + e.getMessage());
        }
    }
}
