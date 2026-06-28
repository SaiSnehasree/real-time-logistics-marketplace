package com.sneha.logisticsmarketplace.dto;

import lombok.Data;

@Data
public class ShipmentRequest {

    private String origin;
    private String destination;
    private double weight;
}