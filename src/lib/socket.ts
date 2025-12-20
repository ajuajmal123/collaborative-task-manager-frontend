import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (userId: string) => {
  if (!socket) {
    socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL!, 
      {
        auth: {
          userId, 
        },
        withCredentials: true,
        transports: ["polling","websocket"],
      }
    );
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;