import {MenuService} from '../services/MenuService';
import { Utils } from '../../config/tools/Utils';
import { CustomExceptions } from '../../config/tools/CustomExceptions';

class MenuModel{
    static async viewIngredients(){
        return await MenuService.viewIngredients();
    }
}
export {MenuModel};