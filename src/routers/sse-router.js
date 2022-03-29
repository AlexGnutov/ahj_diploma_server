const Router = require('@koa/router');
const {streamEvents} = require('http-event-stream');

class SseRouter {
    constructor(messagesService) {
        this.messagesService = messagesService;
        this.router = new Router();

        // Sends last messages
        this.router.get('/api/messages/sse', (ctx, next) => {
           const messages = JSON.stringify(
               this.messagesService.getPrevious(Date.now(), '5')
           );
            streamEvents(ctx.req, ctx.res, {
                async fetch(lastEventId) {
                    console.log(lastEventId);
                    return [];
                },
                stream(sse) {
                    sse.sendEvent({
                        data: messages,
                    })
                    return () => {};
                }
            });
            ctx.respond = false;
        });

        // Send content information
        this.router.get('/api/messages/sse/info', (ctx, next) => {
            const update = this.messagesService.getContentInformation.bind(this.messagesService);
            streamEvents(ctx.req, ctx.res, {
                async fetch(lastEventId) {
                    console.log(lastEventId);
                    return [];
                },
                stream(sse) {
                    const interval = setInterval(() => {
                        sse.sendEvent({
                            data: JSON.stringify(update()),
                        });
                    }, 5000);
                    return () => clearInterval(interval);
                }
            });
            ctx.respond = false;
        });
    }
}

module.exports = SseRouter;
