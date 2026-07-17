package com.sneha.logisticsmarketplace.controller;

import com.sneha.logisticsmarketplace.dto.ApiResponse;
import com.sneha.logisticsmarketplace.dto.AuthResponse;
import com.sneha.logisticsmarketplace.dto.LoginRequest;
import com.sneha.logisticsmarketplace.dto.RegisterRequest;
import com.sneha.logisticsmarketplace.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response, response.getMessage()));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(response, response.getMessage()));
    }
}