package com.sneha.logisticsmarketplace.service;

import com.sneha.logisticsmarketplace.dto.ShipmentRequest;
import com.sneha.logisticsmarketplace.entity.Shipment;
import com.sneha.logisticsmarketplace.entity.ShipmentStatus;
import com.sneha.logisticsmarketplace.repository.BidRepository;
import com.sneha.logisticsmarketplace.repository.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.Map;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final BidRepository bidRepository;

    public Shipment createShipment(
            ShipmentRequest request) {

        Shipment shipment = Shipment.builder()
                .origin(request.getOrigin())
                .destination(request.getDestination())
                .weight(request.getWeight())
                .trackingId(UUID.randomUUID().toString())
                .status(ShipmentStatus.AVAILABLE)
                .build();

        return shipmentRepository.save(shipment);
    }

    public List<Shipment> getAllShipments() {
        return shipmentRepository.findAll();
    }
    public Map<String, Long> getAnalytics() {

        Map<String, Long> analytics = new HashMap<>();

        analytics.put("totalShipments",
                shipmentRepository.count());

        analytics.put("available",
                shipmentRepository.countByStatus(
                        ShipmentStatus.AVAILABLE));

        analytics.put("awaitingPickup",
                shipmentRepository.countByStatus(
                        ShipmentStatus.AWAITING_PICKUP));

        analytics.put("inTransit",
                shipmentRepository.countByStatus(
                        ShipmentStatus.IN_TRANSIT));

        analytics.put("delivered",
                shipmentRepository.countByStatus(
                        ShipmentStatus.DELIVERED));

        return analytics;
    }

    public void deleteShipment(Long id) {

        bidRepository.deleteByShipmentId(id);

        shipmentRepository.deleteById(id);
    }
}