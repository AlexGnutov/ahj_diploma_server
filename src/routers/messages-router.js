const Router = require('@koa/router');
const MessagesService = require('../services/messages-service')

class MessagesRouter {
    constructor(messagesService) {
        this.messagesService = messagesService;
        this.router = new Router();
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
