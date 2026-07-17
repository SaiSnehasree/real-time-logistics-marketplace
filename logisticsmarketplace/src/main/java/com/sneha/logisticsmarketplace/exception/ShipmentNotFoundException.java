package com.sneha.logisticsmarketplace.exception;

public class ShipmentNotFoundException extends RuntimeException {
    public ShipmentNotFoundException(String message) {
        super(message);
    }
}
