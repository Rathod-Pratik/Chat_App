import { Router } from "express";
import { getMessages } from "../Controllers/MessageController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
const messagesRoutes=Router();

messagesRoutes.post("/get-messages",verifyToken,getMessages);

export default messagesRoutes;