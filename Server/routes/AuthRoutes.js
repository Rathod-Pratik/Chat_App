import { Router } from 'express';
import  {login, signup}  from '../Controllers/AuthController.js';

const AuthRoutes = Router();

AuthRoutes.post('/signup', signup);
AuthRoutes.post('/login', login);

export default AuthRoutes;
