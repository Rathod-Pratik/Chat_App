import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/Store";
import { GET_ALL_MESSAGES_ROUTE, HOST } from "@/utils/Constants";
import moment from "moment";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import React, { useEffect, useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

const MessageContainer = () => {
  const [showImage, setShowImage] = useState(false);
  const [ImageURL, setImageURL] = useState(null);
  const scrollRef = useRef();

  const {
    selectedChatData,
    selectedChatType,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages,
  } = useAppStore();

  useEffect(() => {
    if (scrollRef.current && selectedChatMessages.length) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error.message);
      }
    };
    if (selectedChatData._id && selectedChatType === "contact") {
      getMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  const checkImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const DownloadFile = async (url) => {
    try {
      
      const response = await apiClient.get(`${HOST}/${url}`, {
        responseType: "blob",
      });
      const blobUrl = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", url.split("/").pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("File download failed:", error.message);
      alert("Failed to download the file. Please try again later.");
    }
  };

  const HandleCloseImage = () => {
    setShowImage(false);
    setImageURL(null);
  };

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className=" text-center text-gray-500 my-2 ">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
        </div>
      );
    });
  };

  const renderDMMessages = (message) => (
    <div
      className={`${
        message.sender === selectedChatData._id ? "text-right" : "text-left"
      }`}
    >
      {message.messageType === "text" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? " bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              : " bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {message.content}
        </div>
      )}
      {message.messageType === "file" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? " bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              : " bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {checkImage(message.fileUrl) ? (
            <div className="cursor-pointer ">
              <img
                onClick={() => {
                  setShowImage(true);
                  setImageURL(message.fileUrl);
                }}
                src={`${HOST}/${message.fileUrl}`}
                height={300}
                width={300}
                alt=""
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <span className=" text-white/80 p-3 text-3xl bg-black/20 rounded-full">
                <MdFolderZip />
              </span>
              <span>{message.fileUrl.split("/").pop()}</span>
              <span
                onClick={() => DownloadFile(message.fileUrl)}
                className="bg-black/20 p-3 text-2xl rounded-full cursor-pointer transition-all hover:bg-black/50"
              >
                <IoMdArrowRoundDown />
              </span>
            </div>
          )}
        </div>
      )}
      <div className="text-xs text-gray-600">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );

  return (
    <div className=" flex-1 overflow-y-auto scrolllbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw]">
      {renderMessages()}
      <div ref={scrollRef} />
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 w-[100vw] h-[100vh] flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img
              src={`${HOST}/${ImageURL}`}
              className="h-[80vh] w-full bg-cover"
              alt=""
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              className="bg-black/20 p-3 text-2xl rounded-full cursor-pointer transition-all hover:bg-black/50"
              onClick={() => DownloadFile(ImageURL)}
            >
              <IoMdArrowRoundDown />
            </button>

            <button
              className="bg-black/20 p-3 text-2xl rounded-full cursor-pointer transition-all hover:bg-black/50"
              onClick={HandleCloseImage}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
