package com.sneha.logisticsmarketplace.service;

import com.sneha.logisticsmarketplace.dto.BidRequest;
import com.sneha.logisticsmarketplace.entity.*;
import com.sneha.logisticsmarketplace.repository.BidRepository;
import com.sneha.logisticsmarketplace.repository.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BidService {

    private final BidRepository bidRepository;
    private final ShipmentRepository shipmentRepository;

    public Bid placeBid(BidRequest request) {

        Shipment shipment =
                shipmentRepository.findById(request.getShipmentId())
                        .orElseThrow();

        Bid bid = Bid.builder()
                .amount(request.getAmount())
                .status(BidStatus.PENDING)
                .shipment(shipment)
                .build();

        return bidRepository.save(bid);
    }
    public String acceptBid(Long bidId) {

        Bid acceptedBid = bidRepository.findById(bidId)
                .orElseThrow();

        Shipment shipment = acceptedBid.getShipment();

        shipment.setStatus(ShipmentStatus.AWAITING_PICKUP);

        acceptedBid.setStatus(BidStatus.ACCEPTED);

        bidRepository.save(acceptedBid);

        List<Bid> allBids =
                bidRepository.findByShipmentId(shipment.getId());

        for (Bid bid : allBids) {

            if (!bid.getId().equals(acceptedBid.getId())) {

                bid.setStatus(BidStatus.REJECTED);

                bidRepository.save(bid);
            }
        }

        shipmentRepository.save(shipment);

        return "Bid accepted successfully";
    }
}