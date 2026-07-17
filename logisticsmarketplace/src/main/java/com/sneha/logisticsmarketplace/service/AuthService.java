package com.sneha.logisticsmarketplace.service;

import com.sneha.logisticsmarketplace.dto.AuthResponse;
import com.sneha.logisticsmarketplace.dto.LoginRequest;
import com.sneha.logisticsmarketplace.dto.RegisterRequest;
import com.sneha.logisticsmarketplace.entity.Role;
import com.sneha.logisticsmarketplace.entity.User;
import com.sneha.logisticsmarketplace.exception.DuplicateResourceException;
import com.sneha.logisticsmarketplace.repository.UserRepository;
import com.sneha.logisticsmarketplace.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new DuplicateResourceException("Email is already registered");
        }
        
        Role role = request.getRole() != null ? request.getRole() : Role.CUSTOMER;

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse("User registered successfully", token, savedUser.getName(), savedUser.getRole().name(), savedUser.getId());
    }

    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse("Login successful", token, user.getName(), user.getRole().name(), user.getId());
    }
}