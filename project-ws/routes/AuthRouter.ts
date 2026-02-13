import { Router } from "express";
import { AuthController } from '../app/controllers/AuthController';
import { Middleware } from "../config/server/Middleware";

const router = Router();

//Definicion de rutas, tipo de peticion, necesidad de autenticacion asi como origen y metodo
router.post('/signin', Middleware(0), AuthController.signIn);
router.post('/signup',Middleware(0), AuthController.signUp);


export default router;