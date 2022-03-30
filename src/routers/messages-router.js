const Router = require('@koa/router');
const MessagesService = require('../services/messages-service')
const {streamEvents} = require("http-event-stream");

class MessagesRouter {
    constructor(messagesService) {
        this.messagesService = messagesService;
        this.router = new Router();

        // Sends latest messages, default = 5 pcs.
        this.router.get('/api/messages/latest', (ctx, next) => {
            ctx.response.body = this.messagesService.getPrevious(Date.now(), '5');
        });

        // Sends requested quantity of messages from defined position
        this.router.get('/api/messages', async (ctx) => {
            const { startIndex, qty } = ctx.request.query;
            if (startIndex && qty) {
                ctx.response.body = this.messagesService.getSelection(startIndex, qty);
                return;
            }
            if (startIndex && !qty) {
                ctx.response.body = this.messagesService.getSelection(startIndex);
                return;
            }
            ctx.response.body = this.messagesService.getAll();
        })
        // Send more messages (after scrolling or button), default = 2 pcs.
        this.router.get('/api/messages/next', async (ctx) => {
            const { lastDate, qty } = ctx.request.query;
            if (lastDate) {
                console.log(lastDate)
                ctx.response.body = this.messagesService.getPrevious(lastDate);
                return;
            }
            ctx.response.body = [];
        })
    }
}

module.exports = MessagesRouter;
