
// Define el puerto en el que el servidor escuchará las solicitudes.
// Primero intenta obtener el valor del puerto desde una variable de entorno (process.env.PORT).
// Si no está definido, utiliza el puerto 3000 por defecto.
export const SERVER_PORT: number = Number(process.env.PORT) || 3000;

// Define el nombre del host para la conexión a la base de datos MySQL
export const HOST_MYSQL: string = "localhost";

// Define el nombre de usuario para la conexión a la base de datos MySQL
export const USER_MYSQL: string = "root";

// Define la contraseña para el usuario de la base de datos MySQL
export const PASSWORD_MYSQL: string = "";

// Define el nombre de la base de datos a la que se conectará la aplicación MySQL
export const DATABASE_MYSQL: string = "pedidosDB";

