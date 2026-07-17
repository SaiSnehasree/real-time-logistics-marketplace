package com.sneha.logisticsmarketplace.service;

import com.sneha.logisticsmarketplace.dto.ShipmentRequest;
import com.sneha.logisticsmarketplace.entity.NotificationType;
import com.sneha.logisticsmarketplace.entity.Shipment;
import com.sneha.logisticsmarketplace.entity.ShipmentStatus;
import com.sneha.logisticsmarketplace.entity.Role;
import com.sneha.logisticsmarketplace.entity.User;
import com.sneha.logisticsmarketplace.exception.ShipmentNotFoundException;
import com.sneha.logisticsmarketplace.exception.UnauthorizedActionException;
import com.sneha.logisticsmarketplace.repository.BidRepository;
import com.sneha.logisticsmarketplace.repository.ShipmentRepository;
import com.sneha.logisticsmarketplace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new UnauthorizedActionException("User not found"));
    }

    public Shipment createShipment(
            ShipmentRequest request) {

        User shipper = getCurrentUser();

        Shipment shipment = Shipment.builder()
                .origin(request.getOrigin())
                .destination(request.getDestination())
                .weight(request.getWeight())
                .trackingId(UUID.randomUUID().toString().substring(0, 10).toUpperCase())
                .status(ShipmentStatus.AVAILABLE)
                .shipper(shipper)
                .build();

        return shipmentRepository.save(shipment);
    }

    public List<Shipment> getAllShipments() {
        return shipmentRepository.findAll();
    }
    
    public List<Shipment> getMyShipments() {
        User user = getCurrentUser();
        if (user.getRole() == Role.CARRIER) {
            return shipmentRepository.findByCarrierId(user.getId());
        }
        return shipmentRepository.findByShipperId(user.getId());
    }

    public List<Shipment> getMarketplaceShipments() {
        return shipmentRepository.findByStatusIn(List.of(ShipmentStatus.AVAILABLE));
    }

    public Map<String, Long> getAnalytics() {
        Map<String, Long> analytics = new HashMap<>();
        analytics.put("totalShipments", shipmentRepository.count());
        analytics.put("available", shipmentRepository.countByStatus(ShipmentStatus.AVAILABLE));
        analytics.put("awaitingPickup", shipmentRepository.countByStatus(ShipmentStatus.AWAITING_PICKUP));
        analytics.put("inTransit", shipmentRepository.countByStatus(ShipmentStatus.IN_TRANSIT));
        analytics.put("delivered", shipmentRepository.countByStatus(ShipmentStatus.DELIVERED));
        return analytics;
    }

    public Shipment updateStatus(Long id, String statusString) {
        Shipment shipment = shipmentRepository.findById(id)
                .orElseThrow(() -> new ShipmentNotFoundException("Shipment not found"));
        
        // Ensure carrier owns this shipment if they are updating it
        User currentUser = getCurrentUser();
        if (currentUser.getRole().name().equals("CARRIER") && 
            (shipment.getCarrier() == null || !shipment.getCarrier().getId().equals(currentUser.getId()))) {
            throw new UnauthorizedActionException("You are not the carrier for this shipment");
        }
                
        ShipmentStatus status = ShipmentStatus.valueOf(statusString.toUpperCase());
        shipment.setStatus(status);
        
        Shipment savedShipment = shipmentRepository.save(shipment);
        
        // Notify shipper about status change
        NotificationType notifType = null;
        if (status == ShipmentStatus.IN_TRANSIT) {
            notifType = NotificationType.SHIPMENT_IN_TRANSIT;
        } else if (status == ShipmentStatus.DELIVERED) {
            notifType = NotificationType.DELIVERED;
        } else if (status == ShipmentStatus.AWAITING_PICKUP) {
            notifType = NotificationType.SHIPMENT_PICKED_UP;
        }
        
        if (notifType != null) {
            notificationService.createAndSendNotification(
                shipment.getShipper().getId(),
                notifType,
                "Shipment " + shipment.getTrackingId() + " is now " + status.name().replace("_", " "),
                shipment.getId()
            );
        }
        
        return savedShipment;
    }

    public void deleteShipment(Long id) {
        Shipment shipment = shipmentRepository.findById(id)
                .orElseThrow(() -> new ShipmentNotFoundException("Shipment not found"));
                
        if (!shipment.getShipper().getId().equals(getCurrentUser().getId())) {
            throw new UnauthorizedActionException("You can only delete your own shipments");
        }
        
        bidRepository.deleteByShipmentId(id);
        shipmentRepository.deleteById(id);
    }
}