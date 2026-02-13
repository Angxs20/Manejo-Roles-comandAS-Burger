import {MenuModel} from '../models/MenuModel';
import { Utils } from '../../config/tools/Utils';
import { CustomExceptions } from '../../config/tools/CustomExceptions';

class MenuController{
    static async viewIngredients(req: any, res: any){
        const result = await MenuModel.viewIngredients();

        res.json(result);
    }
}
export {MenuController};