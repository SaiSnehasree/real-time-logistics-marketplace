package com.sneha.logisticsmarketplace.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "shipments", indexes = {
    @Index(name = "idx_shipment_tracking_id", columnList = "trackingId"),
    @Index(name = "idx_shipment_shipper_id", columnList = "shipper_id"),
    @Index(name = "idx_shipment_carrier_id", columnList = "carrier_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String origin;

    private String destination;

    private double weight;

    @Column(unique = true)
    private String trackingId;

    @Enumerated(EnumType.STRING)
    private ShipmentStatus status;

    @ManyToOne
    @JoinColumn(name = "shipper_id")
    private User shipper;

    @ManyToOne

    @JoinColumn(name = "carrier_id")
    private User carrier;
}