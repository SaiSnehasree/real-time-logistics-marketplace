package com.sneha.logisticsmarketplace.service;

import com.sneha.logisticsmarketplace.entity.Notification;
import com.sneha.logisticsmarketplace.entity.NotificationType;
import com.sneha.logisticsmarketplace.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public void createAndSendNotification(Long userId, NotificationType type, String message, Long shipmentId) {
        Notification notification = Notification.builder()
                .userId(userId)
                .type(type)
                .message(message)
                .shipmentId(shipmentId)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        notification = notificationRepository.save(notification);

        // Broadcast to specific user
        messagingTemplate.convertAndSend("/topic/notifications/" + userId, notification);
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    public void markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id).orElseThrow();
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsRead(userId);
    }
}
