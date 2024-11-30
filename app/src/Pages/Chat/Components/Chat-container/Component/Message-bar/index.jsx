import { useSocket } from "@/context/socketContext";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/Store";
import { UPLOAD_FILE_ROUTE } from "@/utils/Constants";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
const MessageBar = () => {
  const socket =useSocket();
  const {selectedChatData,selectedChatType,userInfo}= useAppStore();
  const emojiRef = useRef();
  const FileInputRef = useRef();
  const [emojiPicker, setemojiPicker] = useState(false);
  const [Message, SetMessage] = useState("");
  const handleAddEmoji = (emoji) => {
    SetMessage((msg) => msg + emoji.emoji);
  };
  const HandleSendMessage = () => {
    if(selectedChatType=="contact"){
      socket.emit("sendMessage",{
        sender:userInfo.id,
        content:Message,
        recipient:selectedChatData._id,
        messageType:"text",
        fileUrl:undefined
      })
    }
  };
  useEffect(()=>{
function handleClickOutside(event){
    if(emojiRef.current && !emojiRef.current.contains(event.target)){
        setemojiPicker(false);
    }
}
    document.addEventListener("mousedown",handleClickOutside);

    return ()=>{
        document.removeEventListener("mousedown",handleClickOutside);
    }
},[emojiRef])
const handleAttachmentClick=()=>{
  if(FileInputRef.current){
    FileInputRef.current.click();
  }
}
const handleAttachmentChange=async(event)=>{
try {
  const file=event.target.files[0];
  if(file){
    const formData=new FormData();
    formData.append("file",file);
    const response=await apiClient.post(UPLOAD_FILE_ROUTE,formData,{withCredentials:true})

    if(response.status===200 && response.data){
      if(selectedChatType==="contact"){
      socket.emit("sendMessage",{
        sender:userInfo.id,
        content:undefined,
        recipient:selectedChatData._id,
        messageType:"file",
        fileUrl:response.data.filePath
      })
    }
  }
  }
} catch (error) {
  console.log(error)
}
}
  return (
    <div className="h-[10vh] bg-[#1c1d25] flex  justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input
          text="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:outline-none"
          placeholder="Enter Message"
          onChange={(e) => SetMessage(e.target.value)}
          value={Message}
        />
        <button onClick={handleAttachmentClick} className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
          <GrAttachment className="text-2xl" />
        </button>
        <input type="file" className="hidden" ref={FileInputRef} onChange={handleAttachmentChange} />
        <div className="relative">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={() => setemojiPicker(true)}
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <div className=" absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
              theme="dark"
              open={emojiPicker}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button
        onClick={HandleSendMessage}
        className="bg-[#8417ff] p-5 focus:border-none flex items-center justify-center hover:bg-[#741bda] focus:bg-[#741bda] rounded-md focus:outline-none focus:text-white duration-300 transition-all"
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
