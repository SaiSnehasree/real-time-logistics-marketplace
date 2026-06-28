package com.sneha.logisticsmarketplace.controller;

import com.sneha.logisticsmarketplace.dto.BidRequest;
import com.sneha.logisticsmarketplace.entity.Bid;
import com.sneha.logisticsmarketplace.service.BidService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bids")
@RequiredArgsConstructor
public class BidController {

    private final BidService bidService;

    @PostMapping
    public Bid placeBid(
            @RequestBody BidRequest request) {

        return bidService.placeBid(request);
    }
    @PutMapping("/{id}/accept")
    public String acceptBid(
            @PathVariable Long id) {

        return bidService.acceptBid(id);
    }
}