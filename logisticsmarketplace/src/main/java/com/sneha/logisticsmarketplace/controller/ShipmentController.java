package com.sneha.logisticsmarketplace.controller;

import com.sneha.logisticsmarketplace.dto.ShipmentRequest;
import com.sneha.logisticsmarketplace.entity.Shipment;
import com.sneha.logisticsmarketplace.service.ShipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/shipments")
@RequiredArgsConstructor
public class ShipmentController {

    private final ShipmentService shipmentService;

    @PostMapping
    public Shipment createShipment(
            @RequestBody ShipmentRequest request) {

        System.out.println("POST /shipments reached");

        return shipmentService.createShipment(request);
    }

    @GetMapping
    public List<Shipment> getAllShipments() {
        return shipmentService.getAllShipments();
    }
    @GetMapping("/analytics")
    public Map<String, Long> analytics() {
        return shipmentService.getAnalytics();
    }

}