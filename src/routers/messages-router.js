const Router = require('@koa/router');
const MessagesService = require('../services/messages-service')
const {streamEvents} = require("http-event-stream");

class MessagesRouter {
    constructor(messagesService) {
        this.messagesService = messagesService;
        this.router = new Router();

        // Sends latest messages, default = 10 pcs.
        this.router.get('/api/messages/latest', (ctx, next) => {
            ctx.response.body = this.messagesService.getPrevious(Date.now(), '10');
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
        // Search over messages
        this.router.get('/api/messages/search', (ctx) => {
            const { key } = ctx.request.query;
            if (key) {
                ctx.response.body = this.messagesService.findByWordInContent(key);
            } else {
                ctx.throw(400, 'No key word provided');
            }
        });

        // Delete one message
        this.router.get('/api/messages/delete', async (ctx) => {
            const { id } = ctx.request.query;
            ctx.response.body = this.messagesService.deleteOne(id);
        });
    }
}

module.exports = MessagesRouter;
