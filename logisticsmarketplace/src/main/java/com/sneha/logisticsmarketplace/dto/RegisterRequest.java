package com.sneha.logisticsmarketplace.dto;

import com.sneha.logisticsmarketplace.entity.Role;
import lombok.Data;

@Data
public class RegisterRequest {

    private String name;
    private String email;
    private String password;
    private Role role;
}