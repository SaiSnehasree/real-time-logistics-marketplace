import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import api from './api';

let stompClient = null;
let subscribers = {};

export const connectWebSocket = (onConnect) => {
  if (stompClient && stompClient.active) {
    if (onConnect) onConnect();
    return;
  }

  const token = localStorage.getItem('token');
  
  stompClient = new Client({
    webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/tracking`),
    connectHeaders: {
      Authorization: `Bearer ${token}`
    },
    debug: function (str) {
      console.log('STOMP: ' + str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  stompClient.onConnect = (frame) => {
    console.log('Connected to WebSocket', frame);
    if (onConnect) onConnect();
  };

  stompClient.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
  };

  stompClient.activate();
};

export const subscribeToNotifications = (userId, callback) => {
  if (!stompClient || !stompClient.active) {
    console.warn('WebSocket not connected, cannot subscribe to notifications');
    return null;
  }

  const topic = `/topic/notifications/${userId}`;
  const subscription = stompClient.subscribe(topic, (message) => {
    if (message.body) {
      callback(JSON.parse(message.body));
    }
  });
  
  subscribers[topic] = subscription;
  return subscription;
};

export const subscribeToShipmentLocation = (trackingId, callback) => {
  if (!stompClient || !stompClient.active) {
    console.warn('WebSocket not connected, cannot subscribe to location');
    return null;
  }

  const topic = `/topic/shipment/${trackingId}`;
  const subscription = stompClient.subscribe(topic, (message) => {
    if (message.body) {
      callback(JSON.parse(message.body));
    }
  });

  subscribers[topic] = subscription;
  return subscription;
};

export const unsubscribe = (subscription) => {
  if (subscription) {
    subscription.unsubscribe();
  }
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    console.log('Disconnected from WebSocket');
  }
};
