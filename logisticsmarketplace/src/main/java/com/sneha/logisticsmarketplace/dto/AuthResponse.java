package com.sneha.logisticsmarketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {

    private String message;
    private String token;
    private String name;
    private String role;
    private Long userId;

}