import { Client } from '@stomp/stompjs';
import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';

const useNotification = (userId: string, token: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  useEffect(() => {
    console.log(userId);
    const socket = new SockJS('http://34.124.196.11:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      debug: (str) => console.log('[STOMP DEBUG] ' + str), // ✅ Log toàn bộ hoạt động
      reconnectDelay: 5000, // Tự động kết nối lại sau 5s nếu bị mất kết nối
      onConnect: () => {
        client.subscribe(`/user/${userId}/queue/notifications`, (message) => {
          console.log('message ', message);
          setMessages((prev) => [...prev, message.body]);
        });
      },
      onStompError: (frame) => console.error('🚨 STOMP Error:', frame),
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, [token, userId]);

  useEffect(() => {
    if (messages) {
      console.log('[MEssages]', messages);
    } else {
      console.log('No data');
    }
  }, [messages]);

  return { messages, stompClient };
};

export default useNotification;
