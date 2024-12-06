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
  const { userInfo, selectedChatType, selectedChatData, addMessage,addContactsInDMContacts } = useAppStore(); 

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });

      socket.current.on("connect", () => {
        console.log("Connected to socket Server");
      });

      const handleRecieveMessage = (message) => {
        // if (
        //   selectedChatType !==undefined &&
        //   (selectedChatData._id === message.sender._id ||
        //     selectedChatData._id === message.recipient._id)
        // ){ 
          addMessage(message);
        // }
        addContactsInDMContacts(message);
      };

      const handleRecieveChannelMessage=(message)=>{
        const { selectedChatType, selectedChatData,addMessage,addChannelInChannelList } = useAppStore.getState();
        if(selectedChatType!==undefined && selectedChatData._id === message.channelId){
          addMessage(message);
        }
        addChannelInChannelList(message);
      }
      socket.current.on("recieveMessage", handleRecieveMessage);
      socket.current.on("receive-channel-message",handleRecieveChannelMessage);
      // Cleanup on disconnect
      return () => {
        socket.current.disconnect();
      };
    }
  }, [userInfo]); // Add necessary dependencies

  return <SocketContect.Provider value={socket.current}>{children}</SocketContect.Provider>;
};
