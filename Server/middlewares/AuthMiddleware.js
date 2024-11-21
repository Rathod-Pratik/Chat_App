import { request } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken=(resquest,response,next)=>{
    const token=resquest.cookies.jwt;
    if(!token){
        return response.status(401).send("You are not authenticated!");
    }
    jwt.verify(token,process.env.JWT_KEY,async(err,payload)=>{
        if(err){
            return response.status(403).send("Token is not valid");
        }
        request.userId=payload.userId;
        next();
    })
}