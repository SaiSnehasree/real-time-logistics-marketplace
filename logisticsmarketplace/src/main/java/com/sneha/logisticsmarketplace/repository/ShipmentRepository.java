package com.sneha.logisticsmarketplace.repository;

import com.sneha.logisticsmarketplace.entity.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShipmentRepository
        extends JpaRepository<Shipment, Long> {
}