package com.sneha.logisticsmarketplace.repository;

import com.sneha.logisticsmarketplace.entity.Shipment;
import com.sneha.logisticsmarketplace.entity.ShipmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShipmentRepository
        extends JpaRepository<Shipment, Long> {
    long countByStatus(ShipmentStatus status);
}