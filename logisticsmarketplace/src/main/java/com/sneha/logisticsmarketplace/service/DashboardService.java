package com.sneha.logisticsmarketplace.service;

import com.sneha.logisticsmarketplace.entity.BidStatus;
import com.sneha.logisticsmarketplace.entity.ShipmentStatus;
import com.sneha.logisticsmarketplace.entity.User;
import com.sneha.logisticsmarketplace.exception.UnauthorizedActionException;
import com.sneha.logisticsmarketplace.repository.BidRepository;
import com.sneha.logisticsmarketplace.repository.ShipmentRepository;
import com.sneha.logisticsmarketplace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ShipmentRepository shipmentRepository;
    private final BidRepository bidRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new UnauthorizedActionException("User not found"));
    }

    public Map<String, Long> getStats() {
        User user = getCurrentUser();
        Map<String, Long> stats = new HashMap<>();

        if (user.getRole().name().equals("SHIPPER")) {
            stats.put("totalShipments", shipmentRepository.countByShipperId(user.getId()));
            stats.put("active", shipmentRepository.findByShipperId(user.getId()).stream()
                    .filter(s -> s.getStatus() != ShipmentStatus.DELIVERED)
                    .count());
            stats.put("delivered", shipmentRepository.findByShipperId(user.getId()).stream()
                    .filter(s -> s.getStatus() == ShipmentStatus.DELIVERED)
                    .count());
            stats.put("openBids", (long) bidRepository.findAll().stream()
                    .filter(b -> b.getShipment().getShipper().getId().equals(user.getId()) && b.getStatus() == BidStatus.PENDING)
                    .count());
            stats.put("revenue", 0L); // Shippers pay, so maybe "spend"
        } else if (user.getRole().name().equals("CARRIER")) {
            stats.put("totalShipments", shipmentRepository.countByCarrierId(user.getId()));
            stats.put("active", shipmentRepository.findByCarrierId(user.getId()).stream()
                    .filter(s -> s.getStatus() != ShipmentStatus.DELIVERED)
                    .count());
            stats.put("delivered", shipmentRepository.findByCarrierId(user.getId()).stream()
                    .filter(s -> s.getStatus() == ShipmentStatus.DELIVERED)
                    .count());
            stats.put("openBids", bidRepository.countByCarrierIdAndStatus(user.getId(), BidStatus.PENDING));
            
            // Calculate revenue
            long revenue = bidRepository.findByCarrierId(user.getId()).stream()
                    .filter(b -> b.getStatus() == BidStatus.ACCEPTED && b.getShipment().getStatus() == ShipmentStatus.DELIVERED)
                    .mapToLong(b -> (long) b.getAmount())
                    .sum();
            stats.put("revenue", revenue);
        } else {
            // ADMIN or CUSTOMER
            stats.put("totalShipments", shipmentRepository.count());
            stats.put("active", shipmentRepository.count() - shipmentRepository.countByStatus(ShipmentStatus.DELIVERED));
            stats.put("delivered", shipmentRepository.countByStatus(ShipmentStatus.DELIVERED));
            stats.put("openBids", 0L);
            stats.put("revenue", 0L);
        }

        return stats;
    }
}
