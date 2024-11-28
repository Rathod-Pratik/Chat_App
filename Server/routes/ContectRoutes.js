import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getContactsForDMList, SearchContect } from "../Controllers/ContectControllers.js";

const contectRoutes=Router();

contectRoutes.post('/search',verifyToken,SearchContect);
contectRoutes.get("/get-contact-for-dm",verifyToken,getContactsForDMList)
export default contectRoutes