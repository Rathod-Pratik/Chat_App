import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
const MessageBar = () => {
  const emojiRef = useRef();
  const [emojiPicker, setemojiPicker] = useState(false);
  const [Message, SetMessage] = useState("");
  const handleAddEmoji = (emoji) => {
    SetMessage((msg) => msg + emoji.emoji);
  };
  const HandleSendMessage = () => {};
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
        <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
          <GrAttachment className="text-2xl" />
        </button>
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
