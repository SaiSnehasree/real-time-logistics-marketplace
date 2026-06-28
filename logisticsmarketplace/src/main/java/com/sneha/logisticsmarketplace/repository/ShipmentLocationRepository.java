package com.sneha.logisticsmarketplace.repository;

import com.sneha.logisticsmarketplace.entity.ShipmentLocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShipmentLocationRepository
        extends JpaRepository<ShipmentLocation, Long> {

    Optional<ShipmentLocation> findByTrackingId(String trackingId);
}