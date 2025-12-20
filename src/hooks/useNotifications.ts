import { useEffect, useState } from "react";
import { connectSocket } from "@/lib/socket";
import { useMe } from "./useMe";

export const useNotifications = () => {
  const { data: me } = useMe();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!me?._id) return;

    const socket = connectSocket(me._id);
socket.on("connect", () => {
  console.log("SOCKET CONNECTED:", socket.id);
});
    socket.on("notification:taskAssigned", (payload) => {
      setNotifications((prev) => [payload, ...prev]);
    });

    return () => {
      socket.off("notification:taskAssigned");
    };
  }, [me?._id]);

  return { notifications };
};
