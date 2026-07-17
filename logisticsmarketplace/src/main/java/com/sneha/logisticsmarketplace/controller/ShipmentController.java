package com.sneha.logisticsmarketplace.controller;

import com.sneha.logisticsmarketplace.dto.ApiResponse;
import com.sneha.logisticsmarketplace.dto.ShipmentRequest;
import com.sneha.logisticsmarketplace.entity.Shipment;
import com.sneha.logisticsmarketplace.service.ShipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/shipments")
@RequiredArgsConstructor
public class ShipmentController {

    private final ShipmentService shipmentService;

    @PostMapping
    @PreAuthorize("hasRole('SHIPPER')")
    public ResponseEntity<ApiResponse<Shipment>> createShipment(@RequestBody ShipmentRequest request) {
        Shipment shipment = shipmentService.createShipment(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(shipment, "Shipment created successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('SHIPPER')")
    public ResponseEntity<ApiResponse<Void>> deleteShipment(@PathVariable Long id) {
        shipmentService.deleteShipment(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Deleted successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Shipment>>> getAllShipments() {
        return ResponseEntity.ok(ApiResponse.success(shipmentService.getAllShipments(), "Fetched shipments"));
    }
    
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('SHIPPER', 'CARRIER')")
    public ResponseEntity<ApiResponse<List<Shipment>>> getMyShipments() {
        return ResponseEntity.ok(ApiResponse.success(shipmentService.getMyShipments(), "Fetched your shipments"));
    }

    @GetMapping("/marketplace")
    public ResponseEntity<ApiResponse<List<Shipment>>> getMarketplaceShipments() {
        return ResponseEntity.ok(ApiResponse.success(shipmentService.getMarketplaceShipments(), "Fetched available shipments"));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<Map<String, Long>>> analytics() {
        return ResponseEntity.ok(ApiResponse.success(shipmentService.getAnalytics(), "Fetched analytics"));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SHIPPER', 'CARRIER')")
    public ResponseEntity<ApiResponse<Shipment>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(ApiResponse.success(shipmentService.updateStatus(id, status), "Status updated"));
    }
}