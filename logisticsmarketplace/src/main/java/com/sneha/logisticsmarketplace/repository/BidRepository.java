package com.sneha.logisticsmarketplace.repository;

import com.sneha.logisticsmarketplace.entity.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface BidRepository extends JpaRepository<Bid, Long> {

    List<Bid> findByShipmentId(Long shipmentId);

    @Transactional
    @Modifying
    void deleteByShipmentId(Long shipmentId);
}