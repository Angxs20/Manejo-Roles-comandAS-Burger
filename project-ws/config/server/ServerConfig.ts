import express from "express";
import { SERVER_PORT } from "../../global/Environment";
import socketIO from "socket.io";
import http from "http";

export default class ServerConfig {

    private static _intance: ServerConfig;
    public app: express.Application;
    public port: number;

    public io: socketIO.Server;
    private httpServer: http.Server;

    private constructor() {
        this.app = express();
        this.port = SERVER_PORT;
        this.httpServer = new http.Server(this.app);
        this.io = new socketIO.Server(this.httpServer, {
            cors: { origin: true, credentials: true },
        });
    }

    public static get instance() {
        return this._intance || (this._intance = new this());
    }

    start(callback: any) {
        this.httpServer.listen(this.port, callback);
    }

}
