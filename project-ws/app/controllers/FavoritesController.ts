import { FavoritesModel } from "../models/FavoritesModel";
import { Utils } from "../../config/tools/Utils";
import { CustomExceptions } from "../../config/tools/CustomExceptions";

class FavoritesController {
    static async toggleFavorite(req: any, res: any) {
        const { iduser, idproduct, action } = req.body;
        // action: 'add' o 'remove'
        
        if (Utils.hasEmptyParams([iduser, idproduct, action])) 
            throw new CustomExceptions("007");

        let result;
        if (action === 'add') {
            result = await FavoritesModel.add(iduser, idproduct);
        } else {
            result = await FavoritesModel.remove(iduser, idproduct);
        }
        res.json(result);
    }

    static async getFavorites(req: any, res: any) {
        const keyParams = req.query.params;
        const params = JSON.parse(keyParams);
        const { iduser } = params;

        if (Utils.hasEmptyParams([iduser])) throw new CustomExceptions("007");

        const result = await FavoritesModel.getByUser(iduser);
        res.json(result);
    }
}

export { FavoritesController };