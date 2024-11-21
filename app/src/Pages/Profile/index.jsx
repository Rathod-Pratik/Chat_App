import { useAppStore } from "@/Store";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import {
  ADD_PROFILE_IMAGE_ROUTE,
  HOST,
  REMOVE_PROFILE_IMAGE_ROUTE,
  UPDATE_PROFILE_ROUTE,
} from "@/utils/Constants";
const Profile = () => {
  // const fileInputRef = useRef(null);

  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [Image, setImage] = useState("");
  const [hovered, sethovered] = useState(false);
  const [selectedColor, setselectedColor] = useState();

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First Name is required");
      return false;
    }
    if (!lastName) {
      toast.error("Last Name is required");
      return false;
    }
    return true;
  };
  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data });
          toast.success("Profile Updated successfully.");
          navigate("/chat");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    if (userInfo.profileSetup) {
      setfirstName(userInfo.firstName);
      setlastName(userInfo.lastName);
      setselectedColor(userInfo.color);
    }
    if(userInfo.image){
      setImage(`${HOST}${userInfo.image}`)
    }
  });
  const handleNavigation = () => {
    if (userInfo.profileSetup) {
      navigate("./chat");
    } else {
      toast.error("Please setup Profile");
    }
  };
  const handleFileInputClick = async () => {
    document.getElementById("fileInput").click();
  };
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);
       const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
         withCredentials: true,
       });
       if (response.status === 200 && response.data.image) {
         setUserInfo({ ...userInfo, Image: response.data.image });
         toast.success("Image updated successfully");
       }
      const reader = new FileReader();

      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleDeleteImage = async () => {
    try {
      const response=await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE,{withCredentials:true})
      if(response.status===200){
        setUserInfo({...userInfo,Image:null})
        toast.success("Image removed successfully.");
        setImage(null);
      }
    } catch (error) {
      
    }
  };
  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick={handleNavigation}>
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 relative flex items-center justify-center "
            onMouseEnter={() => sethovered(true)}
            onMouseLeave={() => sethovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden border-[1px] ">
              {Image ? (
                <AvatarImage
                  src={Image}
                  alt="Profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl flex items-center justify-center rounded-full ${getColor(
                    selectedColor
                  )}`}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}

              {hovered && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 cursor-pointer rounded-full"
                  onClick={Image ? handleDeleteImage : handleFileInputClick}

                >
                  {Image ? (
                    <FaTrash className="text-white text-3xl cursor-pointer" />
                  ) : (
                    <FaPlus className="text-white text-3xl cursor-pointer" />
                  )}{" "}
                </div>
              )}
            </Avatar>
            <input
              type="file"
              className="hidden"
              id="fileInput"
              onChange={handleImageChange}
              name="profile-image"
              accept=".png, .jpeg, .jpg, .svg, .webp"
            />
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email}
                className="rounded-lg p-6 bg-[#2c2e3b]"
              />
            </div>

            <div className="w-full">
              <Input
                onChange={(e) => setfirstName(e.target.value)}
                placeholder="First Name"
                type="email"
                value={firstName}
                className="rounded-lg p-6 bg-[#2c2e3b]"
              />
            </div>

            <div className="w-full">
              <Input
                placeholder="Last Name"
                type="text"
                onChange={(e) => setlastName(e.target.value)}
                value={lastName}
                className="rounded-lg p-6 bg-[#2c2e3b]"
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((data, index) => {
                return (
                  <div
                    key={index}
                    className={`${data} h-8 w-8 rounded-full cursor-pointer transition-all ${
                      selectedColor === index
                        ? "outline outline-white outline-1"
                        : ""
                    } `}
                    onClick={() => setselectedColor(index)}
                  ></div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button
            className="bg-purple-700 w-full hover:bg-purple-900 transition-all duration-300"
            onClick={saveChanges}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
