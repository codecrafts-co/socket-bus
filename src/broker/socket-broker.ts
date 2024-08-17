import { createServer, Server as HttpServer } from 'http';
import { Socket, Server as SocketServer, ServerOptions as SocketServerOptions } from 'socket.io';
import { logger, SocketList } from '../utils';

export interface SocketBrokerOptions extends Partial<SocketServerOptions> {
    authenticationType?: 'none' | 'keyAndSecret';
    auth?: {
        key: string;
        secret: string;
    };
}

const defaultSocketBrokerOptions: SocketBrokerOptions = {
    cors: {
        origin: '*',
        credentials: true,
    },
    connectionStateRecovery: {
        // the backup duration of the sessions and the packets
        maxDisconnectionDuration: 2 * 60 * 1000,
        // whether to skip middlewares upon successful recovery
        skipMiddlewares: true,
    },
    authenticationType: 'none',
};

export class SocketBroker {
    private httpServer: HttpServer;
    private socketServer: SocketServer;
    private socketList: SocketList;
    private authenticationType: SocketBrokerOptions['authenticationType'];
    private auth: SocketBrokerOptions['auth'];

    constructor(options: SocketBrokerOptions = defaultSocketBrokerOptions) {
        const { authenticationType, auth, ...rest } = options;

        this.httpServer = createServer();

        this.socketServer = new SocketServer(this.httpServer, { ...rest });

        this.socketList = new SocketList();

        this.authenticationType = authenticationType;
        this.auth = auth;

        this.init();
    }

    private init() {
        if (this.authenticationType === 'keyAndSecret') {
            this.socketServer.use(this.authKeyAndSecretAuthentication.bind(this));
        }

        this.socketServer.on('connection', (socket) => {
            this.onSocketConnect(socket);

            socket.onAny((eventName, ...args) => {
                this.onSocketEvent(eventName, ...args);
            });

            socket.on('disconnect', () => {
                this.onSocketDisconnect(socket);
            });
        });
    }

    private authKeyAndSecretAuthentication(socket: Socket, next: (err?: Error) => void) {
        const { authKey, authSecret } = socket.handshake.auth;

        if (!authKey || !authSecret) {
            return next(new Error('Authentication error: Missing authKey or authSecret'));
        }

        // Validate authKey and authSecret
        if (authKey !== this.auth?.key || authSecret !== this.auth?.secret) {
            return next(new Error('Authentication error: Invalid authKey or authSecret'));
        }

        next(); // Allow the connection
    }

    private onSocketConnect(socket: Socket) {
        if (socket.handshake.query.groupId) {
            // If the connecting socket has a groupId, add the socket to that group
            logger.log(`Socket connected - [SocketId]:${socket.id}, [GroupId]:${socket.handshake.query.groupId}.`);

            this.socketList.addToGroup(socket.handshake.query.groupId as string, socket.id);
        } else {
            logger.log(`Socket connected - [SocketId]:${socket.id}.`);

            this.socketList.add(socket.id);
        }
    }

    private onSocketEvent(eventName: string, ...args: any[]) {
        const socketIds = this.socketList.getUniqueSockets();

        this.socketServer.to(socketIds).emit(eventName, ...args);
    }

    private onSocketDisconnect(socket: Socket) {
        if (socket.handshake.query.groupId) {
            logger.warn(`Socket disconnected - [SocketId]:${socket.id}, [GroupId]:${socket.handshake.query.groupId}`);

            this.socketList.deleteFromGroup(socket.handshake.query.groupId as string, socket.id);
        } else {
            logger.warn(`Socket disconnected - [SocketId]:${socket.id}`);

            this.socketList.delete(socket.id);
        }
    }

    listen(port: number, cb?: () => void) {
        this.httpServer.listen(port, cb);
    }
}
