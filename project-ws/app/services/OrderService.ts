import { DatabaseMethods } from "../../config/database/DatabaseMethods";
import { Utils } from "../../config/tools/Utils";
import { CustomExceptions } from "../../config/tools/CustomExceptions";
import { error } from "console";

class OrderService {
  static async createOrder(
    total: number,
    origin: string,
    comments: string,
    client: string,
    users_idusers: string,
    order_details: any
  ) {
    const idOrder = Utils.UUID();
    const queries = [];

    queries.push({
      query:
        "INSERT INTO `order`(`idorder`, `total`, `origin`, `comments`, `client`, `users_idusers`) VALUES (?,?,?,?,?,?)",
      params: [idOrder, total, origin, comments, client, users_idusers],
    });
    order_details.forEach(
      (element: {
        unit_price: any;
        order_type: any;
        comments: any;
        products_idproducts: any;
        not_ingredient: any;
      }) => {
        const idOrderDetails = Utils.UUID();
        queries.push({
          query:
            "INSERT INTO `order_details`(`idorderdetail`, `unit_price`, `order_type`, `comments`, `order_idorder`, `products_idproducts`) VALUES (?,?,?,?,?,?)",
          params: [
            idOrderDetails,
            element.unit_price,
            element.order_type,
            element.comments,
            idOrder,
            element.products_idproducts,
          ],
        });
        element.not_ingredient.forEach(
          (ingredient: { ingredients_idingredients: any; type: any }) => {
            queries.push({
              query:
                "INSERT INTO `not_ingredient`(`ingredients_idingredients`, `order_details_idorderdetail`, `type`) VALUES (?,?,?)",
              params: [
                ingredient.ingredients_idingredients,
                idOrderDetails,
                ingredient.type,
              ],
            });
          }
        );
      }
    );

    const res = await DatabaseMethods.save_transaction(queries);
    if (res.error) return res;

    return { error: false, msg: idOrder };
  }
  static async viewOrder(idorder: string) {

    const res = await DatabaseMethods.query({
      query:
        "SELECT o.idorder, o.client, o.total, o.status, o.comments, MONTH(o.date) mes, od.idorderdetail, od.order_type, od.comments as comments_product, p.name product, c.name category FROM `order` AS O JOIN order_details od ON od.order_idorder = o.idorder JOIN products p ON p.idproducts=od.products_idproducts JOIN category c ON c.idcategory =p.category_idcategory WHERE idorder=?",
      params: [idorder],
    });
    if (res.error) return res;

    const msj = res.msg;

    if (typeof msj === "string") {
      throw new CustomExceptions("004");
    }
    if (!msj) throw new CustomExceptions("004");
    for (const [key, value] of Object.entries(msj)) {
      const res2 = await DatabaseMethods.query({
        query:
          "SELECT ni.ingredients_idingredients, ni.type, i.name FROM not_ingredient ni JOIN ingredients i ON ni.ingredients_idingredients = i.idingredients WHERE order_details_idorderdetail=?",
        params: [value.idorderdetail],
      });

      msj[Number(key)].ingredients = res2.msg;
    }
    return { error: false, msg: msj };
  }
  static async viewOrders() {
    const res = await DatabaseMethods.query({
      query:
        "SELECT o.idorder, o.client, o.total, o.status, o.comments, MONTH(o.date) mes FROM `order` AS O WHERE active='1' ORDER BY o.date ASC",
      params: [],
    });
    return res;
  }
  static async updateStatus(
    idorder: string,
    status: number,
    users_idusers: string
  ) {
    const queries = [];
    switch (status) {
      case 1:
        queries.push({
          query:
            "UPDATE `order` SET status=?, start_order = CURRENT_TIMESTAMP() WHERE idorder=?",
          params: [status, idorder],
        });
        queries.push({
          query: "UPDATE `users` SET actual_order=? WHERE idusers=?",
          params: [idorder, users_idusers],
        });
        break;
      case 2:
        queries.push({
          query:
            "UPDATE `order` SET status=?, finish_order = CURRENT_TIMESTAMP() WHERE idorder=?",
          params: [status, idorder],
        });
        queries.push({
          query: "UPDATE `users` SET actual_order=null WHERE idusers=?",
          params: [users_idusers],
        });
        break;
      case 3:
        queries.push({
          query: "UPDATE `order` SET status=? WHERE idorder=?",
          params: [status, idorder],
        });
        break;
      case 4:
        queries.push({
          query: "UPDATE `order` SET status=? WHERE idorder=?",
          params: [status, idorder],
        });
        break;
    }
    return await DatabaseMethods.save_transaction(queries);
  }
  static async lastOrder(iduser:string){
    const res = await DatabaseMethods.query_one({
        query: "SELECT u.actual_order, o.status, o.client, o.total, MONTH(o.date), o.comments FROM users u JOIN `order` o ON o.idorder= u.actual_order WHERE u.idusers = ?",
        params: [iduser]
    });
    const msj = res.msg;
    if (!msj) return {error:false,msg:null};
    if (typeof msj === "string") {
      throw new CustomExceptions("004");
    }
    if(msj.status == 1){
      return await OrderService.viewOrder(msj.actual_order);
    }
  }

  static async viewOrdersByUser(iduser: string) {
    const res = await DatabaseMethods.query({
      query:
        "SELECT o.idorder, o.total, o.status, o.comments, o.date, o.client FROM `order` AS O WHERE users_idusers=? ORDER BY o.date DESC",
      params: [iduser],
    });
    return res;
  }
}
export { OrderService };
