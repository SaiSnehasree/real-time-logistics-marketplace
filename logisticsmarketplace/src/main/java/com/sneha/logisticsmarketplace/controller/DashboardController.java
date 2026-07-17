package com.sneha.logisticsmarketplace.controller;

import com.sneha.logisticsmarketplace.dto.ApiResponse;
import com.sneha.logisticsmarketplace.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    @PreAuthorize("hasAnyAuthority('SHIPPER', 'CARRIER')")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getStats(), "Dashboard stats fetched successfully"));
    }
}
