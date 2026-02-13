import { Request, Response, NextFunction } from "express";
import { Jwt } from "../../config/tools/Jwt";
import crypto from 'crypto';

// Genera un hash MD5 de una cadena específica para autenticar solicitudes.
// La cadena original es 'Aqui va tu contraseña (Yo la encripte en MD5)'.
// La función 'crypto.createHash' crea un hash MD5, que se actualiza con la cadena proporcionada,
// y finalmente se convierte en una cadena hexadecimal.
const secretPhrase = 'hola123'; 
const simpleAuth = crypto.createHash('md5').update(secretPhrase).digest('hex');

// Middleware de autenticación que verifica el tipo de autenticación basado en 'typeAuth'.
// 'typeAuth' determina el método de autenticación a usar:
// - 0: Autenticación simple basada en un hash MD5.
// - 1: Autenticación basada en un token JWT (JSON Web Token).
const Middleware = (typeAuth: number) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Respuesta de error estándar si la autenticación falla.
        const error_res = { error: true, msg: 'no_token' };
        try {
            // Obtiene los encabezados de la solicitud.
            const headers = req.headers;

            // Verifica el tipo de autenticación.
            if (typeAuth == 0) {
                console.log('--- DEBUG MIDDLEWARE ---');
                console.log('Esperado (MD5 de hola123):', simpleAuth);
                console.log('Recibido desde Postman:', headers['simple']);
                // Si 'typeAuth' es 0, se usa autenticación simple basada en hash MD5.
                // Compara el valor del encabezado 'simple' con el hash MD5 predefinido.
                // Si no coinciden, devuelve un error 401 (No Autorizado).
                if (headers['simple'] !== simpleAuth) return res.status(401).json(error_res);
            } else {
                // Si 'typeAuth' no es 0, se usa autenticación basada en JWT.
                // Verifica que el encabezado 'authorization' exista y que el token JWT sea válido.
                // La función 'Jwt.check' se encarga de validar el token JWT.
                // Si el token no está presente o no es válido, devuelve un error 401 (No Autorizado).
                if (!headers['authorization'] || !await Jwt.check(headers['authorization'])) return res.status(401).json(error_res);
            }
            // Si la autenticación es exitosa, pasa al siguiente middleware o controlador.
            next();
        } catch (error) {
            // En caso de error en el middleware, devuelve un error 500 (Error Interno del Servidor).
            return res.status(500).json(error_res);
        }
    }
}

export { Middleware };