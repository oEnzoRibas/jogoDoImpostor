import { useEffect } from "react";
import { socketService } from "../services/socket";

export function useSocketEvent<T>(
  eventName: string,
  callback: (data: T) => void,
) {
  useEffect(() => {
    const socket = socketService.socket;

    if (!socket) return;

    const handler = (data: T) => {
      console.log(`📡 [Socket] ${eventName}:`, data);
      callback(data);
    };

    socket.on(eventName, handler);

    return () => {
      socket.off(eventName, handler);
    };
  }, [eventName, callback]);
}
