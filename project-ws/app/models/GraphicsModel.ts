import { GraphicsService } from '../services/GraphicsService';
import { Utils } from '../../config/tools/Utils';
import { CustomExceptions } from '../../config/tools/CustomExceptions';
import { OrderService } from '../services/OrderService';

class GraphicsModel{
    static async totalSales(){
        return await GraphicsService.totalSales();
    }
    static async bestSeller(mes:string){
        const res = await GraphicsService.bestSeller();        
        let count = 0;
        let labels = ["","",""];
        let data = ["","",""];
        if (res.error) return res;

        const msj = res.msg;
        if (typeof msj === 'string') {
            throw new CustomExceptions('004');
        }
        msj.forEach(element => {
            if(element.mes == mes){
                if(count<=2){
                    if(count == 0){
                        labels[1] = "#1 "+element.categoria+":"+element.producto;
                        data[1] = element.cantidad;
                    }else if(count == 1){
                        labels[0] = "#2 "+element.categoria+":"+element.producto;
                        data[0] = element.cantidad;
                    }else{
                        labels[2] = "#3 "+element.categoria+":"+element.producto;
                        data[2] = element.cantidad;
                    }
                    count++;
                }
            }
        });
        return {error:false, msg:{"labels": labels, "data":data}};
    }
    static async bestClient(){
        const res = await GraphicsService.bestClient();        
        let count = 0;
        let labels = ["","",""];
        let data = ["","",""];
        if (res.error) return res;

        const msj = res.msg;
        if (typeof msj === 'string') {
            throw new CustomExceptions('004');
        }
        msj.forEach(element => {
            
                if(count<=2){
                    if(count == 0){
                        labels[1] = "#1 "+element.client;
                        data[1] = element.compras;
                    }else if(count == 1){
                        labels[0] = "#2 "+element.client;
                        data[0] = element.compras;
                    }else{
                        labels[2] = "#3 "+element.client;
                        data[2] = element.compras;
                    }
                    count++;
                }
            
        });
        return {error:false, msg:{"labels": labels, "data":data}};
    }
    static async sales(){
        let labels = {'Enero' : 1, 'Febrero' : 2, 'Marzo' : 3, 'Abril' : 4, 'Mayo' : 5, 'Junio' : 6, 'Julio' : 7, 'Agosto' : 8, 'Septiembre' : 9, 'Octubre' : 10, 'Noviembre' : 11, 'Diciembre':12};
        let labelsAux = [];
        let data = [];
        const res = await GraphicsService.sales();
        if (res.error) return res;

        const msj = res.msg;
        if (typeof msj === 'string') {
            throw new CustomExceptions('004');
        }
        for (const [mes, num] of Object.entries(labels)) {
            let valor = 0;
            msj.forEach(element => {
                if(element.mes == num) valor = Number(element.total);
            });
            labelsAux.push(mes);
            data.push(valor);
        }
        
        
        return { error:false, msg:{"labels": labelsAux, "data": data}};
    }
    static async avgTime(){
        return await GraphicsService.avgTime();
    }
}
export {GraphicsModel};