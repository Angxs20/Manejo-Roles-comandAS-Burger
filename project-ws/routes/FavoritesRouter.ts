import { Router } from "express";
import { FavoritesController } from "../app/controllers/FavoritesController";
import { Middleware } from "../config/server/Middleware";

const router = Router();

router.post('/toggle', Middleware(1), FavoritesController.toggleFavorite);
router.get('/list', Middleware(1), FavoritesController.getFavorites);

export default router;