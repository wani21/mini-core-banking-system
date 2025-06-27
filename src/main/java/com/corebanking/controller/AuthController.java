
package com.corebanking.controller;

import com.corebanking.dto.LoginRequest;
import com.corebanking.dto.LoginResponse;
import com.corebanking.dto.UserRegistrationRequest;
import com.corebanking.entity.User;
import com.corebanking.security.JwtTokenProvider;
import com.corebanking.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Optional<User> userOptional = userService.findByUsername(loginRequest.getUsername());
            
            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid username or password");
            }
            
            User user = userOptional.get();
            
            // Check if account is locked
            if (userService.isAccountLocked(user)) {
                return ResponseEntity.badRequest().body("Account is temporarily locked. Please try again later.");
            }
            
            // Validate password
            if (!userService.validatePassword(user, loginRequest.getPassword())) {
                userService.incrementFailedLoginAttempts(user);
                return ResponseEntity.badRequest().body("Invalid username or password");
            }
            
            // Update last login
            userService.updateLastLogin(user);
            
            // Generate JWT token
            String token = jwtTokenProvider.generateToken(user.getUsername());
            
            LoginResponse response = new LoginResponse(
                    token,
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole().name()
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Login failed: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserRegistrationRequest registrationRequest) {
        try {
            User user = userService.createCustomerUser(registrationRequest);
            return ResponseEntity.ok("User registered successfully with username: " + user.getUsername());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // JWT tokens are stateless, so logout is handled client-side
        return ResponseEntity.ok("Logged out successfully");
    }
}
