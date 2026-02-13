import { GraphicsModel } from "../models/GraphicsModel";
import { Utils } from "../../config/tools/Utils";
import { CustomExceptions } from "../../config/tools/CustomExceptions";

class GraphicsController {
  static async totalSales(req: any, res: any) {
    const result = await GraphicsModel.totalSales();
    res.json(result);
  }
  static async bestSeller(req: any, res: any) {
    const keyParams = req.query.params;
    let params;
    params = JSON.parse(keyParams);

    const { mes } = params;
    if (Utils.hasEmptyParams([mes])) throw new CustomExceptions("007");
    const result = await GraphicsModel.bestSeller(mes);
    res.json(result);
  }
  static async bestClient(req: any, res: any) {
    const result = await GraphicsModel.bestClient();
    res.json(result);
  }
  static async sales(req: any, res: any) {
    const result = await GraphicsModel.sales();
    res.json(result);
  }
  static async avgTime(req: any, res: any) {
    const result = await GraphicsModel.avgTime();
    res.json(result);
  }
}
export { GraphicsController };
