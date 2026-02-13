import { UserModel } from "../models/UserModel";
import { Utils } from "../../config/tools/Utils";
import { CustomExceptions } from "../../config/tools/CustomExceptions";
import { AuthModel } from "../models/AuthModel";

class UserController {
  static async createUser(req: any, res: any) {
    try {
      const { name, password, phone, rol } = req.body;
      if (Utils.hasEmptyParams([name, password, phone, rol]))
        throw new CustomExceptions("007");

      const result = await AuthModel.signUp(name, password, phone, rol);
      res.json(result);
    } catch (error) {
      if (error instanceof CustomExceptions) {
        res.status(400).json(error.GetOptions());
      } else {
        res.status(500).json({ error: true, message: "Internal Server Error" });
      }
    }
  }
  static async viewUsers(req: any, res: any) {
    const result = await UserModel.viewUsers();
    res.json(result);
  }
  static async viewUser(req: any, res: any) {
    const keyParams = req.query.params;
    let params;
    params = JSON.parse(keyParams);

    const { idusers } = params;
    if (Utils.hasEmptyParams([idusers])) throw new CustomExceptions('007');
    const result = await UserModel.viewUser(idusers);
    res.json(result);
  }

    static async updateClientProfile(req: any, res: any) {
        const { iduser, name, phone } = req.body;
        
        // Validamos que vengan los datos
        if (Utils.hasEmptyParams([iduser, name, phone])) 
            throw new CustomExceptions("007");

        const result = await UserModel.updateClientProfile(iduser, name, phone);
        res.json(result);
    }

  static async deleteUser(req:any, res:any){
    const keyParams = req.query.params;
    let params;
    params = JSON.parse(keyParams);
    
    const {idusers} = params;
    if (Utils.hasEmptyParams([idusers]))
        throw new CustomExceptions("007");
  
      const result = await UserModel.deleteUser(
        idusers
      );
  
      res.json(result);
  }
}
export { UserController };
