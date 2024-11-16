import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.jsx";
import {Button} from '@/components/ui/button'
import { Input } from "@/components/ui/input.jsx";

const Auth = () => {
  const [Email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");

  const handleLogin=async()=>{

  }
  const handleSignup=async()=>{

  }
  return (
    <div className="h-[100vh] w-[100vw]  flex justify-center items-center">
      <div className="h-[80vh] border-2 border-white bg-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl">welcome</h1>
            </div>
            <p className="font-medium text-clip">
              Fill in the details to get started with the best chat app!
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4">
              <TabsList className="bg-transparent rounded-sm w-full">
                <TabsTrigger
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-sm w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                  value="Login"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-sm w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                  value="Signup"
                >
                  Sign up
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-10" value="Login">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="Password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                />
                <Button className="rounded-full p-6 " onClick={handleLogin}>
                    Login
                </Button>
                
              </TabsContent>
              <TabsContent className="flex flex-col gap-5 " value="Signup">
              <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="Password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  type="Password"
                  className="rounded-full p-6"
                  value={confirmPassword}
                  onChange={(e) => setconfirmPassword(e.target.value)}
                />
                <Button className="rounded-full p-6 " onClick={handleSignup}>
                    Sign Up
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        {/* use to insert image in big screen */}
        {/* <div className="hidden xl:flex  justify-center items-center">
            <img src="" alt="" />
        </div> */}
      </div>
    </div>
  );
};

export default Auth;
