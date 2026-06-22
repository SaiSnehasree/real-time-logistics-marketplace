package com.sneha.logisticsmarketplace.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tracking_updates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrackingUpdate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double latitude;

    private Double longitude;

    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "shipment_id")
    private Shipment shipment;
}