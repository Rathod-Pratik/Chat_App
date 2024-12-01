import React, { useState } from "react";
import { animationDefaultOption, getColor } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Lottie from "react-lottie";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { HOST, SEARCH_CONTECTS_ROUTES } from "@/utils/Constants";
import { useAppStore } from "@/Store";

const NewDM = () => {
  const {setSelectedChatType,setSelectedChatData}=useAppStore();
  const [openNewContectModel, setOpenNewContectModel] = useState(false);
  const [SearchContects, setSearchContect] = useState([]);
  const SearchContect = async (SearchTerm) => {
    try {
      if (SearchTerm.length > 0) {
        const response = await apiClient.post(
          SEARCH_CONTECTS_ROUTES,
          { SearchTerm },
          { withCredentials: true }
        );
        if (response.status == 200 && response.data.Contects) {
          setSearchContect(response.data.Contects);
        }
      } else {
        setSearchContect([]);
      }
    } catch (error) {}
  };
  const selectNewContect=(contect)=>{
    setSelectedChatType('contact');
    setSelectedChatData(contect);
    setOpenNewContectModel(false);
    setSearchContect([]);
  }
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className=" text-neutral-400 font-light text-opacity-90 hover:text-neutral-100 cursor-pointer transition-all duration-300 text-start"
              onClick={() => setOpenNewContectModel(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Select New Contect
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContectModel} onOpenChange={setOpenNewContectModel}>
        <DialogContent className="bg-[#181920] text-white w-[400px] h-[400px]">
          <DialogHeader>
            <DialogTitle>Please Select a Contect</DialogTitle>
            <DialogDescription>
              <div>
                <Input
                  placeholder="Search Contects"
                  className="rounded-lg bg-[#2c2e3b] p-6 border-none"
                  onChange={(e) => SearchContect(e.target.value)}
                />
              </div>
              {SearchContects.length > 0 &&  <ScrollArea className="h-[250px]">
                <div className="flex flex-col gap-5 mt-2">
                  {SearchContects.map((contect) => (
                    <div
                      key={contect._id}
                      onClick={()=>selectNewContect(contect)}
                      className="flex gap-3 items-center cursor-pointer"
                    >
                      <div className="w-12 h-12 relative">
                        <Avatar className="h-12 w-12 rounded-full overflow-hidden border-[1px] ">
                          {contect.image ? (
                              <AvatarImage
                                src={`${HOST}/${contect.image}`}
                                alt="Profile"
                                className="object-cover w-full h-full bg-black"
                              />
                          ) : (
                            <div
                              className={`uppercase h-12 w-12  text-lg flex items-center justify-center rounded-full ${getColor(
                                contect.color
                              )}`}
                            >
                              {contect.firstName
                                ? contect.firstName.split("").shift()
                                : contect.email.split("").shift()}
                            </div>
                          )}
                        </Avatar>
                      </div>
                      <div className="flex flex-col">
                        <span>
                          {" "}
                          {contect.firstName && contect.lastName
                            ? `${contect.firstName} ${contect.lastName}`
                            : ""}
                        </span>
                        <span className="text-xs">{contect.email}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>}

              {SearchContects.length <= 0 && (
                <div className="md:mt-10 mt-5 flex-1  md:flex flex-col justify-center items-center duration-1000 transition-all">
                  <Lottie
                    isClickToPauseDisabled={true}
                    height={100}
                    width={100}
                    options={animationDefaultOption}
                  />
                  <div
                    className="text-opacity-80 text-white
             flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300"
                  ></div>
                  <h3 className="poppins-medium text-center">
                    hi<span className="text-purple-500">!</span> Search new
                    <span className=" text-purple-500 "> Contect.</span>
                  </h3>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM;
