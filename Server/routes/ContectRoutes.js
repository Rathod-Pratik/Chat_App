import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { SearchContect } from "../Controllers/ContectControllers.js";

const contectRoutes=Router();

contectRoutes.post('/search',verifyToken,SearchContect);

export default contectRoutes