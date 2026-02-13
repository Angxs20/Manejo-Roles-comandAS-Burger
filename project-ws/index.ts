import ServerConfig from "./config/server/ServerConfig";
import bodyParser from "body-parser";
import cors from "cors";

import AuthRouter from "./routes/AuthRouter";
import SocketRouter from "./routes/SocketRouter";
import MenuRouter from "./routes/MenuRouter";
import OrderRouter from "./routes/OrderRouter";
import GraphicsRouter from "./routes/GraphicsRouter";
import UserRouter from "./routes/UserRouter";
import FavoritesRouter from "./routes/FavoritesRouter";

const server = ServerConfig.instance;

// BodyParser
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

// CORS - Permitir solicitudes desde http://localhost:4200
server.app.use(cors({ origin: 'http://localhost:4200', credentials: true }));

// server.app.options('*', cors());
server.app.options('*');
// Rutas de servicios
server.app.use("/auth", AuthRouter);
server.app.use("/menu", MenuRouter);
server.app.use("/order", OrderRouter);
server.app.use("/graphics", GraphicsRouter);
server.app.use("/user",UserRouter);
server.app.use("/favorites", FavoritesRouter);

// Rutas de los sockets
server.app.use("/socket", SocketRouter);

server.start(() => {
  console.log(`Servidor corriendo en el puerto ${server.port}`);
});