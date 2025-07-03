
package com.corebanking.controller;

import com.corebanking.dto.CustomerRegistrationRequest;
import com.corebanking.entity.Customer;
import com.corebanking.entity.KycStatus;
import com.corebanking.entity.User;
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
@RequestMapping("/customer")
@CrossOrigin(origins = "*")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private UserService userService;

    @PostMapping("/profile")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> createCustomerProfile(@Valid @RequestBody CustomerRegistrationRequest request, 
                                                  Authentication authentication) {
        try {
            String username = authentication.getName();
            Optional<User> userOptional = userService.findByUsername(username);
            
            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            Customer customer = customerService.createCustomerProfile(userOptional.get(), request);
            return ResponseEntity.ok("Customer profile created successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Profile creation failed: " + e.getMessage());
        }
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> getCustomerProfile(Authentication authentication) {
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
            
            return ResponseEntity.ok(customerOptional.get());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get profile: " + e.getMessage());
        }
    }

    @PutMapping("/kyc-documents")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> updateKycDocuments(@RequestBody String kycDocuments, Authentication authentication) {
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
            
            Customer customer = customerService.updateKycDocuments(customerOptional.get().getCustomerId(), kycDocuments);
            return ResponseEntity.ok("KYC documents updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update KYC: " + e.getMessage());
        }
    }

    @GetMapping("/pending-kyc")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getPendingKycCustomers() {
        try {
            List<Customer> pendingCustomers = customerService.findByKycStatus(KycStatus.PENDING);
            return ResponseEntity.ok(pendingCustomers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get pending KYC: " + e.getMessage());
        }
    }

    @PutMapping("/{customerId}/kyc-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateKycStatus(@PathVariable Long customerId, @RequestBody KycStatus kycStatus) {
        try {
            Customer customer = customerService.updateKycStatus(customerId, kycStatus);
            return ResponseEntity.ok("KYC status updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update KYC status: " + e.getMessage());
        }
    }
}
