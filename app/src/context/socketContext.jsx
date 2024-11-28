import { useAppStore } from "@/Store";
import { HOST } from "@/utils/Constants";
import { io } from "socket.io-client";

import { createContext, useContext, useEffect, useRef } from "react";

const SocketContect = createContext(null);

export const useSocket = () => {
  return useContext(SocketContect);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { userInfo, selectedChatType, selectedChatData, addMessage } = useAppStore(); // Moved useAppStore here

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });

      socket.current.on("connect", () => {
        console.log("Connected to socket Server");
      });

      // Move handleRecieveMessage logic outside of the hook
      const handleRecieveMessage = (message) => {
        if (
          selectedChatType !== undefined &&
          (selectedChatData._id === message.sender._id ||
            selectedChatData._id === message.recipient._id)
        ) {
          console.log("Message received", message);
        }
        addMessage(message);
      };

      socket.current.on("recieveMessage", handleRecieveMessage);

      // Cleanup on disconnect
      return () => {
        socket.current.disconnect();
      };
    }
  }, [userInfo]); // Add necessary dependencies

  return <SocketContect.Provider value={socket.current}>{children}</SocketContect.Provider>;
};
