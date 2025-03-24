import { RootState } from '@core/store/store';
import { Stomp } from '@stomp/stompjs';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import SockJS from 'sockjs-client';

const URL = 'http://34.124.196.11:8080/ws';

export const useWebSocket = () => {
  const clientRef = useRef<any>(null); // Dùng useRef để giữ kết nối WebSocket
  const user = useSelector((state: RootState) => state.user);
  useEffect(() => {
    const socket = new SockJS(URL);
    const stompClient = Stomp.over(socket);

    stompClient.connect(
      {
        Authorization: user ? `Bearer ${user.accessToken}` : '',
      },
      () => {
        clientRef.current = stompClient;
      }
    );

    return () => {
      if (stompClient.connected) {
        clientRef.current.disconnect(() => {
          console.log('WebSocket disconnected');
        });
      }
    };
  }, []);

  return { client: clientRef.current };
};
