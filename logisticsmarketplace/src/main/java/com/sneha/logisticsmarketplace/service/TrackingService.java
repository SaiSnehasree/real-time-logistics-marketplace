package com.sneha.logisticsmarketplace.service;

import com.sneha.logisticsmarketplace.dto.TrackingUpdate;
import com.sneha.logisticsmarketplace.entity.ShipmentLocation;
import com.sneha.logisticsmarketplace.entity.Shipment;
import com.sneha.logisticsmarketplace.exception.ShipmentNotFoundException;
import com.sneha.logisticsmarketplace.repository.ShipmentLocationRepository;
import com.sneha.logisticsmarketplace.repository.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TrackingService {

    private final ShipmentLocationRepository locationRepository;
    private final ShipmentRepository shipmentRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public void saveLocation(TrackingUpdate update) {

        Shipment shipment = shipmentRepository.findByTrackingId(update.getTrackingId())
                .orElseThrow(() -> new ShipmentNotFoundException("Invalid tracking ID"));

        ShipmentLocation location =
                locationRepository.findByTrackingId(update.getTrackingId())
                        .orElse(new ShipmentLocation());

        location.setTrackingId(update.getTrackingId());
        location.setLatitude(update.getLatitude());
        location.setLongitude(update.getLongitude());

        locationRepository.save(location);
        
        // Save to tracking update history (if we were using the entity)
        // For now, we broadcast it immediately over WebSocket
        messagingTemplate.convertAndSend("/topic/shipment/" + update.getTrackingId(), update);
    }
}