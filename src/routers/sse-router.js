const Router = require('@koa/router');
const {streamEvents} = require('http-event-stream');

class SseRouter {
    constructor(messagesService) {
        this.messagesService = messagesService;
        this.contentDataCache = '';
        this.router = new Router();

        // Sends last messages

    }


}

module.exports = SseRouter;
