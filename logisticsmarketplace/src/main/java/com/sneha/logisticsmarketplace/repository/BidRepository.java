package com.sneha.logisticsmarketplace.repository;

import com.sneha.logisticsmarketplace.entity.Bid;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BidRepository extends JpaRepository<Bid, Long> {
}