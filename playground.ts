import { SocketBroker } from './src/broker/socket-broker';
import { SocketClient } from './src/client/socket-client';

const socketBroker = new SocketBroker({ authenticationType: 'keyAndSecret', auth: { key: '1', secret: '1' } });

const port = 4000;

socketBroker.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

const socketBrokerUri = `http://localhost:${port}`;

setTimeout(() => {
    new SocketClient(socketBrokerUri, {
        withCredentials: true,
        auth: {
            authKey: '1',
            authSecret: '1',
        },
    });

    // socketClient.on('connect', () => {
    //     console.log('Socket client connected to server.');
    // });
}, 1000);

setTimeout(() => {
    const socket = new SocketClient(socketBrokerUri, {
        withCredentials: true,
        auth: {
            authKey: '1',
            authSecret: '1',
        },
    });

    // socket.on('connect', () => {
    //     console.log('Socket client connected to server.', socket.id);
    // });

    // socket.on('connect_error', (err) => {
    //     console.error('Connection error:', err.message);
    // });

    setTimeout(() => {
        socket.disconnect();
    }, 2000);
}, 2000);

setTimeout(() => {
    const socket = new SocketClient(socketBrokerUri, { withCredentials: true });

    socket.on('connect', () => {
        console.log('Socket client connected to server.', socket.id);
    });
}, 3000);

setTimeout(() => {
    const socket = new SocketClient(socketBrokerUri, { withCredentials: true, query: { groupId: 'ConsumerGroup1' } });

    socket.on('connect', () => {
        console.log('Socket client connected to server.', socket.id);
    });
}, 4000);

setTimeout(() => {
    const socket = new SocketClient(socketBrokerUri, { withCredentials: true, query: { groupId: 'ConsumerGroup1' } });

    socket.on('connect', () => {
        console.log('Socket client connected to server.', socket.id);
    });
}, 5000);

// export { socket };
