package com.sneha.logisticsmarketplace;

import com.sneha.logisticsmarketplace.dto.BidRequest;
import com.sneha.logisticsmarketplace.entity.*;
import com.sneha.logisticsmarketplace.exception.BidNotFoundException;
import com.sneha.logisticsmarketplace.exception.DuplicateResourceException;
import com.sneha.logisticsmarketplace.repository.BidRepository;
import com.sneha.logisticsmarketplace.repository.ShipmentRepository;
import com.sneha.logisticsmarketplace.repository.UserRepository;
import com.sneha.logisticsmarketplace.service.BidService;
import com.sneha.logisticsmarketplace.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class BidServiceTest {

    @Mock
    private BidRepository bidRepository;

    @Mock
    private ShipmentRepository shipmentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private BidService bidService;

    private User carrierUser;
    private User shipperUser;
    private Shipment shipment;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        carrierUser = User.builder().id(2L).email("carrier@test.com").name("Carrier User").role(Role.CARRIER).build();
        shipperUser = User.builder().id(1L).email("shipper@test.com").name("Shipper User").role(Role.SHIPPER).build();
        
        shipment = Shipment.builder()
                .id(10L)
                .trackingId("TRK123")
                .status(ShipmentStatus.AVAILABLE)
                .shipper(shipperUser)
                .build();

        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn("carrier@test.com");
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        when(userRepository.findByEmail("carrier@test.com")).thenReturn(Optional.of(carrierUser));
    }

    @Test
    void placeBid_Success() {
        BidRequest request = new BidRequest();
        request.setShipmentId(10L);
        request.setAmount(1500);

        when(bidRepository.existsByShipmentIdAndCarrierId(10L, 2L)).thenReturn(false);
        when(shipmentRepository.findById(10L)).thenReturn(Optional.of(shipment));
        when(bidRepository.save(any(Bid.class))).thenAnswer(i -> i.getArguments()[0]);

        Bid placed = bidService.placeBid(request);

        assertNotNull(placed);
        assertEquals(1500, placed.getAmount());
        assertEquals(BidStatus.PENDING, placed.getStatus());
        assertEquals(shipment, placed.getShipment());
        assertEquals(carrierUser, placed.getCarrier());
        verify(notificationService, times(1)).createAndSendNotification(eq(1L), any(), anyString(), eq(10L));
    }

    @Test
    void placeBid_DuplicateBid_ThrowsException() {
        BidRequest request = new BidRequest();
        request.setShipmentId(10L);
        request.setAmount(1500);

        when(bidRepository.existsByShipmentIdAndCarrierId(10L, 2L)).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> bidService.placeBid(request));
    }

    @Test
    void acceptBid_Success() {
        // Replace the whole SecurityContext so that getCurrentUser() resolves to the shipper
        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn("shipper@test.com");
        SecurityContext shipperContext = mock(SecurityContext.class);
        when(shipperContext.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(shipperContext);
        when(userRepository.findByEmail("shipper@test.com")).thenReturn(Optional.of(shipperUser));

        Bid acceptedBid = Bid.builder().id(100L).amount(1500).status(BidStatus.PENDING).shipment(shipment).carrier(carrierUser).build();
        Bid otherBid = Bid.builder().id(101L).amount(1600).status(BidStatus.PENDING).shipment(shipment).carrier(User.builder().id(3L).build()).build();

        when(bidRepository.findById(100L)).thenReturn(Optional.of(acceptedBid));
        when(bidRepository.findByShipmentId(10L)).thenReturn(Arrays.asList(acceptedBid, otherBid));

        String result = bidService.acceptBid(100L);

        assertEquals("Bid accepted successfully", result);
        assertEquals(BidStatus.ACCEPTED, acceptedBid.getStatus());
        assertEquals(BidStatus.REJECTED, otherBid.getStatus());
        assertEquals(ShipmentStatus.AWAITING_PICKUP, shipment.getStatus());
        assertEquals(carrierUser, shipment.getCarrier());
        verify(notificationService, times(2)).createAndSendNotification(anyLong(), any(), anyString(), anyLong());
    }
}
