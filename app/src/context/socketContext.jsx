import { useAppStore } from "@/Store";
import { HOST } from "@/utils/Constants";
import { io } from "socket.io-client";

import { createContext,useContext ,useEffect,useRef } from "react";

const SocketContect =createContext(null);

export const useSocket=()=>{
    return useContext(SocketContect);
}
export const SocketProvider=({children})=>{
    const socket=useRef();
    const {userInfo}=useAppStore();

    useEffect(()=>{
        if(userInfo){
            socket.current= io(HOST,{
                withCredentials:true,
                query:{userId:userInfo.id},
            })

            socket.current.on("connect",()=>{
                console.log("Connected to socket Server")
            })
            return ()=>{
                socket.current.disconnect();
            }
        }
    },[userInfo])
    return (
        <SocketContect.Provider value={socket.current}>
            {children}
        </SocketContect.Provider>
    )
}