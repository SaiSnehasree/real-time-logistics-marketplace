package com.sneha.logisticsmarketplace.controller;

import com.sneha.logisticsmarketplace.dto.ApiResponse;
import com.sneha.logisticsmarketplace.dto.BidRequest;
import com.sneha.logisticsmarketplace.entity.Bid;
import com.sneha.logisticsmarketplace.service.BidService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bids")
@RequiredArgsConstructor
public class BidController {

    private final BidService bidService;

    @PostMapping
    @PreAuthorize("hasAuthority('CARRIER')")
    public ResponseEntity<ApiResponse<Bid>> placeBid(
            @RequestBody BidRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(bidService.placeBid(request), "Bid placed successfully"));
    }
    
    @PostMapping("/{id}/accept")
    @PreAuthorize("hasAuthority('SHIPPER')")
    public ResponseEntity<ApiResponse<String>> acceptBid(
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(bidService.acceptBid(id), "Bid accepted"));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAuthority('SHIPPER')")
    public ResponseEntity<ApiResponse<String>> rejectBid(
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(bidService.rejectBid(id), "Bid rejected"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Bid>>> getAllBids() {
        return ResponseEntity.ok(ApiResponse.success(bidService.getAllBids(), "Fetched bids"));
    }
    
    @GetMapping("/my")
    @PreAuthorize("hasAuthority('CARRIER')")
    public ResponseEntity<ApiResponse<List<Bid>>> getMyBids() {
        return ResponseEntity.ok(ApiResponse.success(bidService.getMyBids(), "Fetched your bids"));
    }
    
    @GetMapping("/shipment/{shipmentId}")
    @PreAuthorize("hasAuthority('SHIPPER')")
    public ResponseEntity<ApiResponse<List<Bid>>> getBidsForShipment(@PathVariable Long shipmentId) {
        return ResponseEntity.ok(ApiResponse.success(bidService.getBidsForShipment(shipmentId), "Fetched bids for shipment"));
    }
}