import { DatabaseMethods } from '../../config/database/DatabaseMethods';
import { Utils } from '../../config/tools/Utils';
import { CustomExceptions } from '../../config/tools/CustomExceptions';

class GraphicsService{
    static async totalSales(){
        const res = await DatabaseMethods.query_one({
            query: "SELECT SUM(total) total FROM `order` WHERE status=3",
            params: []
        });
        return res;
    }
    static async bestSeller(){
        return await DatabaseMethods.query({
            query: "SELECT p.name AS producto, COUNT(*) AS cantidad, MONTH(o.date) AS mes, c.name AS categoria FROM order_details od INNER JOIN products p ON p.idproducts = od.products_idproducts INNER JOIN `order` o ON o.idorder = od.order_idorder JOIN category c ON p.category_idcategory = c.idcategory WHERE YEAR(o.date) = YEAR(NOW()) GROUP BY p.name, c.name, MONTH(o.date) ORDER BY cantidad DESC;",
            params:[]
        });
    }
    static async bestClient(){
        return await DatabaseMethods.query({
            query: "SELECT client, COUNT(*) compras, SUM(total) total_compras FROM `order`  GROUP BY client ORDER BY COUNT(*) DESC",
            params: []
        });
    }
    static async sales(){
        return await DatabaseMethods.query({
            query: "SELECT SUM(o.total) total, MONTH(o.date) mes FROM `order` o  WHERE status=3 GROUP BY mes",
            params: []
        });
    }
    static async avgTime(){
        return await DatabaseMethods.query_one({
            query: "SELECT AVG(TIMESTAMPDIFF(MINUTE, start_order, finish_order)) minutos from `order`",
            params: []
        })
    }
}
export {GraphicsService};