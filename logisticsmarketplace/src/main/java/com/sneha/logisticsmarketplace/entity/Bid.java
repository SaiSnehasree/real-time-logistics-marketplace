package com.sneha.logisticsmarketplace.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bids", indexes = {
    @Index(name = "idx_bid_shipment_id", columnList = "shipment_id"),
    @Index(name = "idx_bid_carrier_id", columnList = "carrier_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double amount;

    @Enumerated(EnumType.STRING)
    private BidStatus status;

    @ManyToOne
    @JoinColumn(name = "carrier_id")
    private User carrier;

    @ManyToOne
    @JoinColumn(name = "shipment_id")
    private Shipment shipment;
}