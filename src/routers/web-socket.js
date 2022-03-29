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
                console.log(data);
                this.messagesService.createOne(data);
                ws.send(data); // You don`t need to stringify!
            });
            ws.on('close', () => {
                console.log('connection closed');
            })
        });
    }
}

module.exports = WebSocketController;
