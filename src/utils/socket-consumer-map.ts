export class SocketList {
    // { [groupId: string]: { pointer: number; sockets: Set<string> } }
    private socketGroupMap: Record<string, { pointer: number; sockets: Set<string> }>;
    private nonGroupSocketSet: Set<string>;

    constructor() {
        this.socketGroupMap = {};
        this.nonGroupSocketSet = new Set();
    }

    add(socketId: string) {
        this.nonGroupSocketSet.add(socketId);
    }

    delete(socketId: string) {
        this.nonGroupSocketSet.delete(socketId);
    }

    addToGroup(groupId: string, socketId: string) {
        if (this.socketGroupMap[groupId]) {
            this.socketGroupMap[groupId].sockets.add(socketId);
        } else {
            this.socketGroupMap[groupId] = { pointer: 0, sockets: new Set([socketId]) };
        }
    }

    deleteFromGroup(groupId: string, socketId: string) {
        if (!this.socketGroupMap[groupId]) return;

        this.socketGroupMap[groupId].sockets.delete(socketId);

        if (this.socketGroupMap[groupId].pointer >= this.socketGroupMap[groupId].sockets.size) {
            this.socketGroupMap[groupId].pointer = this.socketGroupMap[groupId].sockets.size - 1;
        }

        if (this.socketGroupMap[groupId].sockets.size === 0) {
            delete this.socketGroupMap[groupId];
        }
    }

    getUniqueSockets() {
        const uniqueSocketsInGroups = Object.values(this.socketGroupMap).reduce((acc, cur) => {
            const sockets = Array.from(cur.sockets);

            if (sockets.length > 0) {
                const socketId = sockets[cur.pointer];

                acc.push(socketId);
                // Update pointer such that it follows round-robin
                cur.pointer = (cur.pointer + 1) % sockets.length;
            }

            return acc;
        }, [] as string[]);

        return [...uniqueSocketsInGroups, ...Array.from(this.nonGroupSocketSet)];
    }
}
