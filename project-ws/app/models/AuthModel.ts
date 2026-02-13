import { AuthService } from '../services/AuthService';
import { Utils } from '../../config/tools/Utils';
import { Jwt } from '../../config/tools/Jwt';
import { CustomExceptions } from '../../config/tools/CustomExceptions';

class AuthModel {
    static async signIn(name: string, password: string) {
        // Manda a llamar el servicio para hacer la auntenticacion 
        const res = await AuthService.signIn(name, password);

        // Checa que no haya error y si si hay, manda el error
        if (res.error) return res;

        // Guardamos lo que viene en la key msg en una variable
        const msj = res.msg;
        
        // Si hay error puede que nos devuelva solamente un string, pero nosotros necesitamos un objeto
        // Entonces evaluamos que no sea un string
        if (typeof msj === 'string') {
            throw new CustomExceptions('004');
        }
        //borramos la contraseña del mensaje
        delete msj.password;
        // modelamos lo que queremos regresar
        return {
            error: false,
            msg: {
                idusers: msj.idusers,
                name: msj.name,
                token: await Jwt.signIn(msj),
                phone: msj.phone,
                rol: msj.rol,
                actual_order: msj.actual_order,
            },
        };
    }
    static async signUp(name: string, password: string, phone: string, rol: number) {
        const id = await Utils.UUID();
        const password_with_hash = await Utils.hash(password);
        return AuthService.signUp(name, password_with_hash,id, phone, rol);
    }
}


export { AuthModel };