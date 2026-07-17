package com.sneha.logisticsmarketplace.controller;

import com.sneha.logisticsmarketplace.dto.ApiResponse;
import com.sneha.logisticsmarketplace.dto.TrackingUpdate;
import com.sneha.logisticsmarketplace.service.TrackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tracking")
@RequiredArgsConstructor
public class TrackingController {

    private final TrackingService trackingService;

    @PostMapping("/update")
    @PreAuthorize("hasAuthority('CARRIER')")
    public ResponseEntity<ApiResponse<String>> updateLocation(@RequestBody TrackingUpdate update) {
        trackingService.saveLocation(update);
        return ResponseEntity.ok(ApiResponse.success("Location updated and broadcasted successfully", "Success"));
    }
}