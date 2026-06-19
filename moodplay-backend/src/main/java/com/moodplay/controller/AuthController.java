package com.moodplay.controller;

import com.moodplay.dto.LoginRequest;
import com.moodplay.dto.LoginResponse;
import com.moodplay.security.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtUtil jwtUtil;

    @Value("${moodplay.admin.username}") private String adminUsername;
    @Value("${moodplay.admin.password}") private String adminPassword;

    public AuthController(JwtUtil jwtUtil) { this.jwtUtil = jwtUtil; }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        if (adminUsername.equals(req.getUsername()) && adminPassword.equals(req.getPassword())) {
            String token = jwtUtil.generateToken(req.getUsername());
            return ResponseEntity.ok(new LoginResponse(token, req.getUsername()));
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }
}
