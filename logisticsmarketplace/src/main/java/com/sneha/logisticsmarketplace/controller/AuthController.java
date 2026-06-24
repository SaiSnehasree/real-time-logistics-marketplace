package com.sneha.logisticsmarketplace.controller;

import com.sneha.logisticsmarketplace.dto.RegisterRequest;
import com.sneha.logisticsmarketplace.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @GetMapping("/test")
    public String test() {
        return "Auth Controller Working";
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }
    @GetMapping("/register-test")
    public String registerTest() {

        RegisterRequest request = new RegisterRequest();

        request.setName("Sneha");
        request.setEmail("sneha@gmail.com");
        request.setPassword("123456");
        request.setRole(
                com.sneha.logisticsmarketplace.entity.Role.SHIPPER
        );

        return authService.register(request);
    }
}