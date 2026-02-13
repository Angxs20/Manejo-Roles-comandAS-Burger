import { Router } from "express";
import { OrderController } from "../app/controllers/OrderController";
import { Middleware } from "../config/server/Middleware";

const router = Router();

// Si Middleware(1) es solo Admin/Cajero, el Cliente (3) rebota.
// Prueba cambiarlo a Middleware(3) o el número que represente "acceso básico".
router.post('/createOrder', Middleware(3), OrderController.createOrder); 

// Rutas de Chef y Admin
router.get('/viewOrders', Middleware(2), OrderController.viewOrders);
router.put('/updateStatus', Middleware(2), OrderController.updateStatus);

// Ruta de Cliente (Mis Pedidos) - También debe permitir Rol 3
router.get('/viewOrdersByUser', Middleware(3), OrderController.viewOrdersByUser);

// Detalles
router.get('/viewOrder', Middleware(1), OrderController.viewOrder);

export default router;  