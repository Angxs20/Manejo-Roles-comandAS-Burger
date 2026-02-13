import { AuthModel } from "../models/AuthModel";
import { Utils } from "../../config/tools/Utils";
import { CustomExceptions } from "../../config/tools/CustomExceptions";

class AuthController {
  static async signIn(req: any, res: any) {
    try {
      // NOTA: las variables deben de llamarse igual que en las keys del json
      const { name, password } = req.body;

      // Aqui pones las variables que no deben estar vacias, nulas o indefinidas
      // NOTA: Se tienen que mandar en arreglo: [email, password]
      if (Utils.hasEmptyParams([name, password]))
        throw new CustomExceptions("007");

      // Se manda a llamar el modelo y se envian las variables del body como lo pide el modelo
      const result = await AuthModel.signIn(name, password);

      // Regresa en formato json el resultado del modelo
      res.json(result);
    } catch (error) {
      if (error instanceof CustomExceptions) {
        res.status(400).json(error.GetOptions());
      } else {
        res.status(500).json({ error: true, message: "Internal Server Error" });
      }
    }
  }
  static async signUp(req: any, res: any) {
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
}

export { AuthController };
