import { DatabaseMethods } from '../../config/database/DatabaseMethods';
import { CustomExceptions } from '../../config/tools/CustomExceptions';
import { Utils } from '../../config/tools/Utils';

class AuthService {
    static async signIn(name: string, password: string) {

        // Peticion a la base de datos Igualita a la de php
        const res = await DatabaseMethods.query_one({
            query: "SELECT * FROM users WHERE name = ? and rol NOT IN (4);",
            params: [name]
        });
        //console.log(res);
        

        // Checa que no haya error y si si hay, manda el error
        if (res.error) return res;

        // Guardamos lo que viene en la key msg en una variable
        const msj = res.msg;

        // Si hay error puede que nos devuelva solamente un string, pero nosotros necesitamos un objeto
        // Entonces evaluamos qu no sea un string
        if (typeof msj === 'string') {
            throw new CustomExceptions('004');
        }

        // Evaluamos si no viene null
        if (!msj) throw new CustomExceptions('004');

        // Checamos si la contraseña coincide
        if (!(await Utils.verify(password, msj.password))) throw new CustomExceptions('005');


        return { error: false, msg: msj };
    }
    static async signUp(name: string, password: string, id: string, phone: string, rol: number) {
        const queries = [
            {
                query: "INSERT INTO `users`(`idusers`, `name`, `password`, `phone`, `rol`) VALUES (?,?,?,?,?)",
                params: [id, name, password, phone,rol]
            },
        ];
        return await DatabaseMethods.save_transaction(queries);
    }
}

export { AuthService };
