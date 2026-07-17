package com.sneha.logisticsmarketplace.repository;

import com.sneha.logisticsmarketplace.entity.Shipment;
import com.sneha.logisticsmarketplace.entity.ShipmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ShipmentRepository
        extends JpaRepository<Shipment, Long> {
    long countByStatus(ShipmentStatus status);
    List<Shipment> findByShipperId(Long shipperId);
    List<Shipment> findByCarrierId(Long carrierId);
    List<Shipment> findByStatusIn(List<ShipmentStatus> statuses);
    Optional<Shipment> findByTrackingId(String trackingId);
    long countByShipperId(Long shipperId);
    long countByCarrierId(Long carrierId);
}