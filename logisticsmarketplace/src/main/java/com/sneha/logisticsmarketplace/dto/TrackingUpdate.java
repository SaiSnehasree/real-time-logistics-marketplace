package com.sneha.logisticsmarketplace.dto;

import lombok.Data;

@Data
public class TrackingUpdate {

    private String trackingId;
    private double latitude;
    private double longitude;
}