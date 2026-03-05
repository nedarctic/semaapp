// 1. import WebSocketServer from ws library
import { WebSocketServer } from 'ws';

// 2. instantiate WebSocketServer
const wss = new WebSocketServer({ noServer: true });

// 3. define event handlers for connection and message on the instance and socket
wss.on("connection", (socket) => {
    socket.on("message", (data) => {
        wss.clients.forEach((client) => {
            if (client.readyState === 1){
                client.send(data.toString());
            }
        });
    })
})

// 4. define the GET handler
export async function GET (req: any) {

    // 5. extract socket and response from request
    const { socket, response } = req.webSocket();

    // 6. upgrade protocol to WebSocket
    wss.handleUpgrade(req, socket, Buffer.alloc(0), (ws) => {
        wss.emit("connection", ws, req);
    });

    return response;
}
