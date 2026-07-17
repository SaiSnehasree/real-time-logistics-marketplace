package com.sneha.logisticsmarketplace.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "shipment_locations", indexes = {
    @Index(name = "idx_location_tracking_id", columnList = "trackingId")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShipmentLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String trackingId;

    private double latitude;

    private double longitude;
}