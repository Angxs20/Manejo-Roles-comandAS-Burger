import { DatabaseMethods } from '../../config/database/DatabaseMethods';

class OrderModel {

    
    static async createOrder(idorder: string, total: number, origin: string, comments: string, client: string, status: number, date: string, users_idusers: string, order_details: any[]) {
        
        // A. Insertar la Orden Principal
        // Usamos los datos (idorder, status, date) que vienen del front
        await DatabaseMethods.save({
            query: "INSERT INTO `orders` (idorder, total, origin, comments, client, status, date, active, users_idusers) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)",
            params: [idorder, total, origin, comments, client, status, date, users_idusers]
        });

        
        for (const item of order_details) {
            await DatabaseMethods.save({
                query: "INSERT INTO order_details (idorderdetail, unit_price, order_type, comments, order_idorder, products_idproducts) VALUES (?, ?, ?, ?, ?, ?)",
                // Usamos el idorderdetail generado en el front
                params: [item.idorderdetail, item.unit_price, item.order_type, item.comments || '', idorder, item.products_idproducts]
            });

            
            if (item.not_ingredient && item.not_ingredient.length > 0) {
                for (const ingredient of item.not_ingredient) {
                    await DatabaseMethods.save({
                        query: "INSERT INTO not_ingredients (type, ingredients_idingredients, order_details_idorderdetail) VALUES (?, ?, ?)",
                        params: [ingredient.type, ingredient.ingredients_idingredients, item.idorderdetail]
                    });
                }
            }
        }

        return { msg: "Orden creada correctamente", idorder: idorder };
    }

   
    static async viewOrdersByUser(iduser: string) {
        const res = await DatabaseMethods.query({
            query: "SELECT o.idorder, o.total, o.status, o.comments, o.date, o.client FROM `orders` AS o WHERE users_idusers=? ORDER BY o.date DESC",
            params: [iduser],
        });
        return res;
    }

   
    static async viewOrders() {
        const query = `
            SELECT o.idorder, o.client, o.total, o.comments, o.status, o.date, o.users_idusers 
            FROM \`orders\` o 
            WHERE o.active = 1 
            ORDER BY o.date DESC
        `;
        return await DatabaseMethods.query({ query, params: [] });
    }

   
    static async viewOrder(idorder: string) {
        // Obtenemos info básica y calculamos el mes para reportes
        const query = `
            SELECT o.*, MONTH(o.date) as mes 
            FROM \`orders\` o 
            WHERE o.idorder = ?
        `;
        const orderData = await DatabaseMethods.query({ query, params: [idorder] });
        
       
        return orderData;
    }

   
    static async updateStatus(idorder: string, status: number) {
       
        let query = "UPDATE `orders` SET status = ? WHERE idorder = ?";
        
       
        if(status === 3) {
             query = "UPDATE `orders` SET status = ?, finish_order = NOW() WHERE idorder = ?";
        }

        return await DatabaseMethods.save({
            query: query,
            params: [status, idorder]
        });
    }

    
    static async lastOrder(iduser: string) {
       
        const query = "SELECT * FROM `orders` WHERE users_idusers = ? AND status < 3 ORDER BY date DESC LIMIT 1";
        return await DatabaseMethods.query({ query, params: [iduser] });
    }
}

export { OrderModel };