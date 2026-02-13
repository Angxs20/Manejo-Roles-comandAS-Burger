import { UserService } from "../services/UserService";
import { Utils } from "../../config/tools/Utils";
import { CustomExceptions } from "../../config/tools/CustomExceptions";
import { DatabaseMethods } from "../../config/database/DatabaseMethods";

class UserModel {
  
  static async viewUsers() {
    return await UserService.viewUsers();
  }
  static async viewUser(idusers: string) {
    return await UserService.viewUser(idusers);
  }
  static async updateUser(idusers: string,name:string,password: string,phone: string,rol: number){
    return await UserService.updateUser(idusers,name,password,phone,rol);
  }
  static async deleteUser(idusers: string){
    return await UserService.deleteUser(idusers);
  }


  static async updateClientProfile(iduser: string, name: string, phone: string) {
        const query = "UPDATE users SET name = ?, phone = ? WHERE idusers = ?";
        return await DatabaseMethods.save({
            query: query,
            params: [name, phone, iduser]
        });
  }
}
export { UserModel };
