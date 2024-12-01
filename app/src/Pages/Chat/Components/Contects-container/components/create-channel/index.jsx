import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import {
  CREATE_CHANNEL_ROUTE,
  GET_ALL_CONTACTS_ROUTE,
} from "@/utils/Constants";
import { useAppStore } from "@/Store";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multipleselect";

const CreateChannel = () => {
  const { setSelectedChatType, setSelectedChatData, addChannel } =
    useAppStore();
  const [newChannelModel, setNewChannelModel] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [SelectContacts, setSelectedContacts] = useState([]);
  const [ChannelName, setChannelName] = useState("");
  useEffect(() => {
    const getData = async () => {
      const response = await apiClient.get(GET_ALL_CONTACTS_ROUTE, {
        withCredentials: true,
      });
      setAllContacts(response.data.contacts);
    };
    getData();
  }, []);

  const createChannel = async () => {
    try {
      if (ChannelName.length >= 0 && SelectContacts.length > 0) {
        const response = await apiClient.post(CREATE_CHANNEL_ROUTE, {
          name: ChannelName,
          members : SelectContacts.map((contact) => contact.value),
        },{withCredentials:true});

        if(response.status===201){
          setChannelName("");
          setSelectedContacts([]);
          setNewChannelModel(false);
          addChannel(response.data.channel)
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className=" text-neutral-400 font-light text-opacity-90 hover:text-neutral-100 cursor-pointer transition-all duration-300 text-start"
              onClick={() => setNewChannelModel(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Create New Channel
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={newChannelModel} onOpenChange={setNewChannelModel}>
        <DialogContent className="bg-[#181920] text-white w-[400px] h-[400px]">
          <DialogHeader>
            <DialogTitle className="mb-2">
              Please fill up the details for a new channel
            </DialogTitle>
            <DialogDescription className="flex flex-col gap-3">
              <Input
                placeholder="Channel Name"
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                onChange={(e) => setChannelName(e.target.value)}
                value={ChannelName}
              />
              <div>
                <MultipleSelector
                  className="rounded-lg bg-[#2c2e3b] py-2 text-wrap"
                  defaultOptions={allContacts}
                  placeholder="Search Contacts"
                  Value={SelectContacts}
                  onChange={setSelectedContacts}
                  emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600">
                      No results found
                    </p>
                  }
                />
              </div>
              <div>
                <Button
                  className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
                  onClick={createChannel}
                >
                  Create channel
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
        {/* <DialogContent className="bg-[#181920] text-white w-[400px] h-[400px] flex flex-col gap-4 p-4">
          <DialogHeader>
            <DialogTitle>
              Please fill up the details for a new channel.
            </DialogTitle>
            <DialogDescription className="flex flex-col gap-3">
              <div>
                <Input
                  placeholder="Channel Name"
                  className="rounded-lg bg-[#2c2e3b] border-none"
                  onChange={(e) => setChannelName(e.target.value)}
                  value={ChannelName}
                />
              </div>
              <div>
                <MultipleSelector
                  className="rounded-lg bg-[#2c2e3b] py-2 text-wrap"
                  defaultOptions={allContacts}
                  placeholder="Search Contacts"
                  Value={SelectContacts}
                  onChange={setSearchContect}
                  emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600">
                      No results found
                    </p>
                  }
                />
              </div>
              <div>
                <Button
                  className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
                  onClick={createChannel}
                >
                  Create channel
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent> */}
      </Dialog>
    </>
  );
};

export default CreateChannel;
