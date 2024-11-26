import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/Store";
import { HOST, LOGOUT_ROUTE } from "@/utils/Constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {IoPowerSharp} from "react-icons/io5"
import { apiClient } from "@/lib/api-client";
import { getColor } from "@/lib/utils";

const ProfileInfo = () => {
    const Navigate=useNavigate();
  const { userInfo,setUserInfo } = useAppStore();
  const logOut=async()=>{
    try {
        const response=await apiClient.post(LOGOUT_ROUTE,{},{withCredentials:true})
        if(response.status===200){
            Navigate('/auth');
            setUserInfo()
        }
    } catch (error) {
        console.log(error);
    }
  }
  return (
    <div className="absolute bottom-0 h-16 flex items-center px-10 w-full bg-[#2a2b33] justify-between">
      <div className="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden border-[1px] ">
            {userInfo.image ? (
                <AvatarImage
                  src={`${HOST}${userInfo.image}`}
                  alt="Profile"
                  className="object-cover w-full h-full bg-black"
                />
            ) : (
              <div
                className={`uppercase h-12 w-12  text-lg flex items-center justify-center rounded-full ${getColor(
                  userInfo.color
                )}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName.split("").shift()
                  : userInfo.email.split("").shift()}
              </div>
            )}
          </Avatar>
        </div>
        <div>
          {userInfo.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : ""}
        </div>
      </div>
      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiEdit2 className="text-purple-500 text-xl font-medium" onClick={()=>Navigate('/profile')} />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              <p >Edit Profile</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <IoPowerSharp className="text-red-500 text-xl font-medium" onClick={logOut} />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
