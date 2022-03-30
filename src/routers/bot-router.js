const Router = require('@koa/router');
const BotService = require('../services/bot-service');

class BotRouter {
    constructor() {
        this.botService = new BotService();
        this.router = new Router();
        // Bot command processing router
        this.router.get('/api/bot', async (ctx) => {
            const {command} = ctx.request.query;
            ctx.response.body = this.botService.getBotsOpinion(command);
        });
    }
}

module.exports = BotRouter;
