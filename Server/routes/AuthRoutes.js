import { Router } from 'express';
import  {addProfileImage, getUserInfo, login, logOut, removeProfileImage, signup, updateProfile}  from '../Controllers/AuthController.js';
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import multer from 'multer';
const AuthRoutes = Router();

const upload=multer({dest:"uploads/profiles/"})

AuthRoutes.post('/signup', signup);
AuthRoutes.post('/login', login);
AuthRoutes.get('/user-info',verifyToken,getUserInfo);
AuthRoutes.post('/update-profile',verifyToken,updateProfile);
AuthRoutes.post('/add-profile-image',upload.single("profile-image"),verifyToken,addProfileImage);
AuthRoutes.delete("/remove-profile-image",verifyToken,removeProfileImage)
AuthRoutes.post('/logout',logOut);
export default AuthRoutes;