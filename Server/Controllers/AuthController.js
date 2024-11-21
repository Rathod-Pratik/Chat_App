import { compare } from 'bcrypt'
import User from '../models/UserModel.js'
import jwt from 'jsonwebtoken'
import {renameSync,unlinkSync} from 'fs'
const maxAge=3*24*60*60*1000

const createToken=(email,userId)=>{
return jwt.sign({email,userId},process.env.JWT_KEY,{expiresIn:maxAge})
}
export const signup = async (request, response, next) => {
  try {
    const{email,password}=request.body;
    if(!email || !password){
    return response.status(400).send("Email and password is required.");
    }


    const user=await User.create({email,password});
    response.cookie("jwt",createToken(email,user.id),{maxAge,secure:true,samesite:"None"})
return response.status(201).send({
    user:{
        id:user.id,
        email:user.email,
        profileSetup:user.profileSetup
    }
})
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server error");
  }
};

export const login= async (request, response, next) => {
  try {
    const{email,password}=request.body;
    if(!email || !password){
    return response.status(400).send("Email and password is required.");
    }


    const user=await User.findOne({email});
    if(!user){
      return response.status(404).send("User with the given email not found")
    }
    const auth=await compare(email,user.id);
    if(!user){
      return response.status(404).send("Password is incorrect.")
    }
    response.cookie("jwt",createToken(email,user.id),{maxAge,secure:true,samesite:"None"})
return response.status(200).send({
    user:{
        id:user.id,
        email:user.email,
        firstName:user.firstName,
        lastName:user.lastName,
        image:user.image,
        profileSetup:user.profileSetup,
        color:user.color
    }
})
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server error");
  }
}
export const getUserInfo=async(request, response, next)=>{
  try{
    const userData=await User.findById(request.userId);
    if(!userData){
      return response.status(404).send("User with the given id not found")
    }
    return response.status(200).json({
      id:userData.id,
      email:userData.email,
      firstName:userData.firstName,
      lastName:userData.lastName,
      image:userData.image,
      profileSetup:userData.profileSetup,
      color:userData.color
  })
  }catch(error){
    console.log(error);
  }
}

export const updateProfile=async(request, response, next)=>{
  try{
    const {userId}=request;
    const {firstName,lastName,color} =request.body;
    if(!firstName || !lastName){
      return response.status(400).send("firstName, lastName and color is required.")
    }
    const userData=await User.findByIdAndUpdate(userId,{
      firstName,lastName,color,profileSetup:true
    },{new:true,runValidators:true})
    return response.status(200).json({
      id:userData.id,
      email:userData.email,
      firstName:userData.firstName,
      lastName:userData.lastName,
      image:userData.image,
      profileSetup:userData.profileSetup,
      color:userData.color
  })
  }catch(error){
    console.log(error);
  }
}

export const addProfileImage=async(request, response, next)=>{
  try{
   if(!request.file){
    return response.status(400).send("File is required.")
   }
   const date=Date.now();
   let fileName = "uploads/profiles/" + date + request.file.originalname;
   renameSync(request.file.path,fileName);

   const updateUser=await User.findByIdAndUpdate(request.userId,{image:fileName},{new:true})

    return response.status(200).json({
      image:updateUser.image,
  })
  }catch(error){
    console.log(error);
  }
}
export const removeProfileImage=async(request, response, next)=>{
  try{
    const {userId}=request;
  const user=await User.findById(userId);
  if(!user){
    return response.status(404).send("User not found");
  }

  if(user.image){
    unlinkSync(user.image)
  }
  user.image=null;
  await user.save();

    return response.status(200).send("Profile image removed successfully.");
  }catch(error){
    console.log(error);
  }
}
