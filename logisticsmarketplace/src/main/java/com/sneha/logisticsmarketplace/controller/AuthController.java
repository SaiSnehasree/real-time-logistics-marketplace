package com.sneha.logisticsmarketplace.controller;

import com.sneha.logisticsmarketplace.dto.AuthResponse;
import com.sneha.logisticsmarketplace.dto.RegisterRequest;
import com.sneha.logisticsmarketplace.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.sneha.logisticsmarketplace.dto.LoginRequest;
import com.sneha.logisticsmarketplace.dto.AuthResponse;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}