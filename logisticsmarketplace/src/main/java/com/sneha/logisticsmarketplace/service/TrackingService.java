package com.sneha.logisticsmarketplace.service;

import com.sneha.logisticsmarketplace.dto.TrackingUpdate;
import com.sneha.logisticsmarketplace.entity.ShipmentLocation;
import com.sneha.logisticsmarketplace.repository.ShipmentLocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TrackingService {

    private final ShipmentLocationRepository locationRepository;

    public void saveLocation(TrackingUpdate update) {

        ShipmentLocation location =
                locationRepository.findByTrackingId(update.getTrackingId())
                        .orElse(new ShipmentLocation());

        location.setTrackingId(update.getTrackingId());
        location.setLatitude(update.getLatitude());
        location.setLongitude(update.getLongitude());

        locationRepository.save(location);
    }
}