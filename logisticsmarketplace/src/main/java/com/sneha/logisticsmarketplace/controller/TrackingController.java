package com.sneha.logisticsmarketplace.controller;

import com.sneha.logisticsmarketplace.dto.TrackingUpdate;
import com.sneha.logisticsmarketplace.service.TrackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class TrackingController {

    private final SimpMessagingTemplate messagingTemplate;
    private final TrackingService trackingService;

    @MessageMapping("/location")
    public void updateLocation(TrackingUpdate update) {

        trackingService.saveLocation(update);

        messagingTemplate.convertAndSend(
                "/topic/tracking/" + update.getTrackingId(),
                update
        );
    }
}