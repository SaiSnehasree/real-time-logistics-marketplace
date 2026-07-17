package com.sneha.logisticsmarketplace;

import com.sneha.logisticsmarketplace.dto.ShipmentRequest;
import com.sneha.logisticsmarketplace.entity.Role;
import com.sneha.logisticsmarketplace.entity.Shipment;
import com.sneha.logisticsmarketplace.entity.ShipmentStatus;
import com.sneha.logisticsmarketplace.entity.User;
import com.sneha.logisticsmarketplace.exception.ShipmentNotFoundException;
import com.sneha.logisticsmarketplace.exception.UnauthorizedActionException;
import com.sneha.logisticsmarketplace.repository.BidRepository;
import com.sneha.logisticsmarketplace.repository.ShipmentRepository;
import com.sneha.logisticsmarketplace.repository.UserRepository;
import com.sneha.logisticsmarketplace.service.NotificationService;
import com.sneha.logisticsmarketplace.service.ShipmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ShipmentServiceTest {

    @Mock
    private ShipmentRepository shipmentRepository;

    @Mock
    private BidRepository bidRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private ShipmentService shipmentService;

    private User testUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        testUser = User.builder()
                .id(1L)
                .email("shipper@test.com")
                .name("Shipper User")
                .role(Role.SHIPPER)
                .build();

        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn("shipper@test.com");
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        when(userRepository.findByEmail("shipper@test.com")).thenReturn(Optional.of(testUser));
    }

    @Test
    void createShipment_Success() {
        ShipmentRequest request = new ShipmentRequest();
        request.setOrigin("Mumbai");
        request.setDestination("Delhi");
        request.setWeight(1000);

        Shipment shipment = Shipment.builder()
                .id(1L)
                .origin("Mumbai")
                .destination("Delhi")
                .weight(1000)
                .trackingId("TRK12345")
                .status(ShipmentStatus.AVAILABLE)
                .shipper(testUser)
                .build();

        when(shipmentRepository.save(any(Shipment.class))).thenReturn(shipment);

        Shipment created = shipmentService.createShipment(request);

        assertNotNull(created);
        assertEquals("Mumbai", created.getOrigin());
        assertEquals("Delhi", created.getDestination());
        assertEquals(ShipmentStatus.AVAILABLE, created.getStatus());
        verify(shipmentRepository, times(1)).save(any(Shipment.class));
    }

    @Test
    void updateStatus_Success() {
        Shipment shipment = Shipment.builder()
                .id(1L)
                .trackingId("TRK123")
                .status(ShipmentStatus.AVAILABLE)
                .shipper(testUser)
                .build();

        when(shipmentRepository.findById(1L)).thenReturn(Optional.of(shipment));
        when(shipmentRepository.save(any(Shipment.class))).thenAnswer(i -> i.getArguments()[0]);

        Shipment updated = shipmentService.updateStatus(1L, "in_transit");

        assertNotNull(updated);
        assertEquals(ShipmentStatus.IN_TRANSIT, updated.getStatus());
        verify(notificationService, times(1)).createAndSendNotification(anyLong(), any(), anyString(), anyLong());
    }

    @Test
    void updateStatus_NotFound_ThrowsException() {
        when(shipmentRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ShipmentNotFoundException.class, () -> shipmentService.updateStatus(1L, "in_transit"));
    }
}
