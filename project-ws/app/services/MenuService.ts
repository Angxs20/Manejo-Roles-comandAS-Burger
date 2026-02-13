import { DatabaseMethods } from '../../config/database/DatabaseMethods';
import { Utils } from '../../config/tools/Utils';
import { CustomExceptions } from '../../config/tools/CustomExceptions';
import { RowDataPacket } from 'mysql2';

class MenuService{
    static async viewIngredients(){
        const res = await DatabaseMethods.query({
            query: "SELECT p.idproducts, p.name, p.price, p.description, p.category_idcategory, c.name as name_category FROM products as p JOIN category c ON c.idcategory = p.category_idcategory WHERE p.active = 1 ORDER BY p.category_idcategory, p.name",
            params: []
        });
         if (res.error) return res;

         const msj = res.msg;
 
         if (typeof msj === 'string') {
             throw new CustomExceptions('004');
         }
        for (const [key, value] of Object.entries(msj)) {
            const res2 = await DatabaseMethods.query({
                query: `
                    SELECT i.idingredients, i.name, i.extra, i.cost, i.stock, i.required 
                    FROM products_ingredients pi 
                    JOIN ingredients i ON i.idingredients = pi.ingredients_idingredients 
                    WHERE pi.products_idProducts = ? 
                    ORDER BY i.name`,
                params: [value.idproducts]
            });
    
            msj[Number(key)].ingredients = res2.msg;
        }
         return { error: false, msg: msj };
    }
}
export {MenuService};