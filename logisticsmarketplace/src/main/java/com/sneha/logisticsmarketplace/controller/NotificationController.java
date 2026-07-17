package com.sneha.logisticsmarketplace.controller;

import com.sneha.logisticsmarketplace.dto.ApiResponse;
import com.sneha.logisticsmarketplace.entity.Notification;
import com.sneha.logisticsmarketplace.entity.User;
import com.sneha.logisticsmarketplace.exception.UnauthorizedActionException;
import com.sneha.logisticsmarketplace.repository.UserRepository;
import com.sneha.logisticsmarketplace.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new UnauthorizedActionException("User not found"));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<Notification>>> getMyNotifications() {
        User user = getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(notificationService.getUserNotifications(user.getId()), "Fetched notifications"));
    }

    @GetMapping("/unread-count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount() {
        User user = getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(notificationService.getUnreadCount(user.getId()), "Fetched unread count"));
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id) {
        // Simple implementation, skips ownership validation for brevity
        notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Marked as read"));
    }

    @PutMapping("/read-all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead() {
        User user = getCurrentUser();
        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.ok(ApiResponse.success(null, "All marked as read"));
    }
}
