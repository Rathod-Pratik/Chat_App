import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getAllContacts, getContactsForDMList, SearchContect } from "../Controllers/ContectControllers.js";

const contectRoutes=Router();

contectRoutes.post('/search',verifyToken,SearchContect);
contectRoutes.get("/get-contact-for-dm",verifyToken,getContactsForDMList)
contectRoutes.get('/get-all-contacts',verifyToken,getAllContacts);

export default contectRoutes