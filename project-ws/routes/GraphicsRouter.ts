import { Router } from "express";
import { GraphicsController } from '../app/controllers/GraphicsController';
import { Middleware } from "../config/server/Middleware";

const router = Router();

router.get('/totalSales',Middleware(1), GraphicsController.totalSales);
router.get('/bestSeller',Middleware(1), GraphicsController.bestSeller);
router.get('/bestClient',Middleware(1), GraphicsController.bestClient);
router.get('/sales',Middleware(1), GraphicsController.sales);
router.get('/avgTime',Middleware(1), GraphicsController.avgTime);

export default router;