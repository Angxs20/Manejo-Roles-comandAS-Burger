import { OrderModel } from "../models/OrderModel";
import { Utils } from "../../config/tools/Utils";
import { CustomExceptions } from "../../config/tools/CustomExceptions";

class OrderController {

 
    static async createOrder(req: any, res: any) {
        const { idorder, total, origin, comments, client, status, date, users_idusers, order_details } = req.body;

  
        if (Utils.hasEmptyParams([idorder, total, client, users_idusers, order_details])) 
            throw new CustomExceptions("007");

        const result = await OrderModel.createOrder(
            idorder,      
            total,
            origin,
            comments,
            client,
            status,       
            date,         
            users_idusers,
            order_details
        );

        res.json(result);
    }
    

    static async viewOrder(req: any, res: any) {
        const keyParams = req.query.params;
        if (!keyParams) throw new CustomExceptions("007"); // Validación extra
        
        const params = JSON.parse(keyParams);
        const { idorder } = params;
        
        if (Utils.hasEmptyParams([idorder])) throw new CustomExceptions('007');
        
        const result = await OrderModel.viewOrder(idorder);
        res.json(result);
    }


    static async viewOrders(req: any, res: any){
        const result = await OrderModel.viewOrders();
        res.json(result);
    }

    
    static async updateStatus(req: any, res: any){
 
        const { idorder, status, users_idusers } = req.body;
        
        if (Utils.hasEmptyParams([idorder, status]))
            throw new CustomExceptions("007");

       
        const result = await OrderModel.updateStatus(idorder, status);
        res.json(result);
    }

   
    static async lastOrder(req: any, res: any){
        const keyParams = req.query.params;
        if (!keyParams) throw new CustomExceptions("007");

        const params = JSON.parse(keyParams);
        const { iduser } = params;
        
        if (Utils.hasEmptyParams([iduser])) throw new CustomExceptions('007');
        
   
        const result = await OrderModel.lastOrder(iduser);
        res.json(result);
    }

    static async viewOrdersByUser(req: any, res: any) {
        const keyParams = req.query.params;
        if (!keyParams) throw new CustomExceptions("007");

        const params = JSON.parse(keyParams);
        const { iduser } = params;
        
        if (Utils.hasEmptyParams([iduser])) throw new CustomExceptions('007');
        
        const result = await OrderModel.viewOrdersByUser(iduser);
        res.json(result);
    }
}

export { OrderController };