package com.sneha.logisticsmarketplace;

import com.sneha.logisticsmarketplace.dto.AuthResponse;
import com.sneha.logisticsmarketplace.dto.LoginRequest;
import com.sneha.logisticsmarketplace.dto.RegisterRequest;
import com.sneha.logisticsmarketplace.entity.Role;
import com.sneha.logisticsmarketplace.entity.User;
import com.sneha.logisticsmarketplace.exception.DuplicateResourceException;
import com.sneha.logisticsmarketplace.repository.UserRepository;
import com.sneha.logisticsmarketplace.security.JwtService;
import com.sneha.logisticsmarketplace.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void register_Success() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Test User");
        request.setEmail("test@test.com");
        request.setPassword("password");
        request.setRole(Role.SHIPPER);

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(request.getPassword())).thenReturn("hashedPassword");
        
        User savedUser = User.builder()
                .id(1L)
                .name(request.getName())
                .email(request.getEmail())
                .password("hashedPassword")
                .role(Role.SHIPPER)
                .build();
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtService.generateToken(request.getEmail())).thenReturn("dummyToken");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("dummyToken", response.getToken());
        assertEquals("SHIPPER", response.getRole());
        assertEquals(1L, response.getUserId());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_DuplicateEmail_ThrowsException() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("duplicate@test.com");

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(new User()));

        assertThrows(DuplicateResourceException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_Success() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@test.com");
        request.setPassword("password");

        User user = User.builder()
                .id(1L)
                .name("Test User")
                .email("test@test.com")
                .role(Role.CARRIER)
                .build();

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(user));
        when(jwtService.generateToken(request.getEmail())).thenReturn("dummyToken");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("dummyToken", response.getToken());
        assertEquals("CARRIER", response.getRole());
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }
}
