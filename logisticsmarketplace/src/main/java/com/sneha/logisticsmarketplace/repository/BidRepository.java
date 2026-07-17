package com.sneha.logisticsmarketplace.repository;

import com.sneha.logisticsmarketplace.entity.Bid;
import com.sneha.logisticsmarketplace.entity.BidStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface BidRepository extends JpaRepository<Bid, Long> {

    List<Bid> findByShipmentId(Long shipmentId);
    
    List<Bid> findByCarrierId(Long carrierId);

    boolean existsByShipmentIdAndCarrierId(Long shipmentId, Long carrierId);
    
    long countByCarrierIdAndStatus(Long carrierId, BidStatus status);
    
    long countByCarrierId(Long carrierId);

    @Transactional
    @Modifying
    void deleteByShipmentId(Long shipmentId);
}