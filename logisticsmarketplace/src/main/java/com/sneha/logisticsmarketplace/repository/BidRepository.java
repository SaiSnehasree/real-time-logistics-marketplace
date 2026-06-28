package com.sneha.logisticsmarketplace.repository;

import com.sneha.logisticsmarketplace.entity.Bid;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BidRepository
        extends JpaRepository<Bid, Long> {

    List<Bid> findByShipmentId(Long shipmentId);
}