package com.sneha.logisticsmarketplace.dto;

import lombok.Data;

@Data
public class BidRequest {

    private Long shipmentId;
    private double amount;
}