import { io, ManagerOptions, Socket, SocketOptions } from 'socket.io-client';
import { logger } from '../utils';

export interface SocketClientOptions extends Partial<ManagerOptions & SocketOptions> {
    groupId?: string;
}

const defaultSocketClientOptions: SocketClientOptions = {
    withCredentials: true,
};

export class SocketClient {
    private socket: Socket;

    constructor(uri: string, options: SocketClientOptions = defaultSocketClientOptions) {
        const { groupId, query, ...rest } = options;

        const socketQuery = query || {};

        if (groupId) {
            socketQuery.groupId = groupId;
        }

        this.socket = io(uri, { query: socketQuery, ...rest });

        this.init();
    }

    get id() {
        return this.socket.id;
    }

    private init() {
        this.socket.on('connect', () => {
            logger.log(`Socket client connected to broker - [SocketId]:${this.socket.id}.`);
        });

        this.socket.on('connect_error', (err) => {
            logger.error(`Socket client failed to connect.`, err.message);
        });

        this.socket.on('disconnect', () => {
            logger.warn(`Socket client disconnected.`);
        });
    }

    on(event: string, listener: (...args: any[]) => void) {
        this.socket.on(event, listener);
    }

    emit(event: string, ...args: any[]) {
        this.socket.emit(event, ...args);
    }

    disconnect() {
        this.socket.disconnect();
    }

    getSocket(): Socket {
        return this.socket;
    }
}
