package com.huehomestay.backend.service;

import com.huehomestay.backend.entity.Notification;
import com.huehomestay.backend.entity.User;
import com.huehomestay.backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendNotification(User user, String title, String message, String type) {
        // 1. Save to database
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .isRead(false)
                .build();
        Notification savedNotification = notificationRepository.save(notification);

        // 2. Send via WebSocket STOMP
        // Destination: /user/{email}/queue/notifications
        messagingTemplate.convertAndSendToUser(
                user.getEmail(),
                "/queue/notifications",
                savedNotification
        );
    }
}
