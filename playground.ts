import { SocketBus } from './src/main/socket-bus';
import { io } from 'socket.io-client';

const socketBus = new SocketBus();

const port = 4000;

socketBus.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

const socketBusUri = `http://localhost:${port}`;

setTimeout(() => {
    const socket = io(socketBusUri, { withCredentials: true });

    socket.on('connect', () => {
        console.log('Socket client connected to server.');
    });
}, 1000);

setTimeout(() => {
    const socket = io(socketBusUri, { withCredentials: true });

    socket.on('connect', () => {
        console.log('Socket client connected to server.', socket.id);
    });

    setTimeout(() => {
        socket.disconnect();
    }, 2000);
}, 2000);

setTimeout(() => {
    const socket = io(socketBusUri, { withCredentials: true });

    socket.on('connect', () => {
        console.log('Socket client connected to server.', socket.id);
    });
}, 3000);

setTimeout(() => {
    const socket = io(socketBusUri, { withCredentials: true, query: { groupId: 'ConsumerGroup1' } });

    socket.on('connect', () => {
        console.log('Socket client connected to server.', socket.id);
    });
}, 4000);

setTimeout(() => {
    const socket = io(socketBusUri, { withCredentials: true, query: { groupId: 'ConsumerGroup1' } });

    socket.on('connect', () => {
        console.log('Socket client connected to server.', socket.id);
    });
}, 5000);

// export { socket };
