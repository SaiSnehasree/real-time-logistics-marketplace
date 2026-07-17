package com.sneha.logisticsmarketplace.service;

import com.sneha.logisticsmarketplace.dto.BidRequest;
import com.sneha.logisticsmarketplace.entity.*;
import com.sneha.logisticsmarketplace.exception.BidNotFoundException;
import com.sneha.logisticsmarketplace.exception.DuplicateResourceException;
import com.sneha.logisticsmarketplace.exception.ShipmentNotFoundException;
import com.sneha.logisticsmarketplace.exception.UnauthorizedActionException;
import com.sneha.logisticsmarketplace.repository.BidRepository;
import com.sneha.logisticsmarketplace.repository.ShipmentRepository;
import com.sneha.logisticsmarketplace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BidService {

    private final BidRepository bidRepository;
    private final ShipmentRepository shipmentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new UnauthorizedActionException("User not found"));
    }

    public Bid placeBid(BidRequest request) {

        User carrier = getCurrentUser();
        
        if (bidRepository.existsByShipmentIdAndCarrierId(request.getShipmentId(), carrier.getId())) {
            throw new DuplicateResourceException("You have already placed a bid on this shipment");
        }

        Shipment shipment =
                shipmentRepository.findById(request.getShipmentId())
                        .orElseThrow(() -> new ShipmentNotFoundException("Shipment not found"));
                        
        if (shipment.getStatus() != ShipmentStatus.AVAILABLE) {
            throw new UnauthorizedActionException("Shipment is no longer available for bidding");
        }

        Bid bid = Bid.builder()
                .amount(request.getAmount())
                .status(BidStatus.PENDING)
                .shipment(shipment)
                .carrier(carrier)
                .build();
                
        Bid savedBid = bidRepository.save(bid);
        
        notificationService.createAndSendNotification(
            shipment.getShipper().getId(),
            NotificationType.NEW_BID,
            "New bid of ₹" + request.getAmount() + " received from " + carrier.getName(),
            shipment.getId()
        );

        return savedBid;
    }

    @Transactional
    public String acceptBid(Long bidId) {

        Bid acceptedBid = bidRepository.findById(bidId)
                .orElseThrow(() -> new BidNotFoundException("Bid not found"));

        Shipment shipment = acceptedBid.getShipment();
        
        if (!shipment.getShipper().getId().equals(getCurrentUser().getId())) {
            throw new UnauthorizedActionException("You do not own this shipment");
        }

        shipment.setStatus(ShipmentStatus.AWAITING_PICKUP);
        shipment.setCarrier(acceptedBid.getCarrier()); // Award the shipment

        acceptedBid.setStatus(BidStatus.ACCEPTED);

        List<Bid> allBids =
                bidRepository.findByShipmentId(shipment.getId());

        for (Bid bid : allBids) {
            if (!bid.getId().equals(acceptedBid.getId())) {
                bid.setStatus(BidStatus.REJECTED);
                notificationService.createAndSendNotification(
                    bid.getCarrier().getId(),
                    NotificationType.BID_REJECTED,
                    "Your bid for shipment " + shipment.getTrackingId() + " was rejected.",
                    shipment.getId()
                );
            }
        }
        
        bidRepository.saveAll(allBids); // Save all in one batch
        shipmentRepository.save(shipment);
        
        notificationService.createAndSendNotification(
            acceptedBid.getCarrier().getId(),
            NotificationType.BID_ACCEPTED,
            "Congratulations! Your bid for shipment " + shipment.getTrackingId() + " was accepted.",
            shipment.getId()
        );

        return "Bid accepted successfully";
    }

    @Transactional
    public String rejectBid(Long bidId) {
        Bid rejectedBid = bidRepository.findById(bidId)
                .orElseThrow(() -> new BidNotFoundException("Bid not found"));

        Shipment shipment = rejectedBid.getShipment();
        
        if (!shipment.getShipper().getId().equals(getCurrentUser().getId())) {
            throw new UnauthorizedActionException("You do not own this shipment");
        }

        rejectedBid.setStatus(BidStatus.REJECTED);
        bidRepository.save(rejectedBid);
        
        notificationService.createAndSendNotification(
            rejectedBid.getCarrier().getId(),
            NotificationType.BID_REJECTED,
            "Your bid for shipment " + shipment.getTrackingId() + " was rejected.",
            shipment.getId()
        );

        return "Bid rejected successfully";
    }

    public List<Bid> getAllBids() {
        return bidRepository.findAll();
    }
    
    public List<Bid> getMyBids() {
        User carrier = getCurrentUser();
        return bidRepository.findByCarrierId(carrier.getId());
    }
    
    public List<Bid> getBidsForShipment(Long shipmentId) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new ShipmentNotFoundException("Shipment not found"));
                
        if (!shipment.getShipper().getId().equals(getCurrentUser().getId())) {
            throw new UnauthorizedActionException("You do not own this shipment");
        }
        
        return bidRepository.findByShipmentId(shipmentId);
    }
}