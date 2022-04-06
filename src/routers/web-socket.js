const WS = require('ws');

class WebSocketController {
    constructor(server, messagesService) {
        this.wss = new WS.Server({server});
        this.messagesService = messagesService;
        this.addRoutes();
    }

    addRoutes() {
        this.wss.on('connection', (ws, req) => {
            console.log('ws connected');
            ws.on('message', (bytes, isBinary) => {
                const message = isBinary ? bytes : bytes.toString();
                const data = JSON.parse(message);
                const newMessage = this.messagesService.createOne(data);
                if (newMessage) {
                    this.wss.clients.forEach((client) => {
                        client.send(JSON.stringify(newMessage)); // You don`t need to stringify!
                    });
                }
            });
            ws.on('close', () => {
                console.log('connection closed');
            })
        });
    }
}

module.exports = WebSocketController;
