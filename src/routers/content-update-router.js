const Router = require('@koa/router');
const { PassThrough } = require('stream');
const EventEmitter = require('events');

class ContentUpdateRouter {
    constructor() {
        this.router = new Router();
        this.events = new EventEmitter();
        this.initialData = '';
        this.events.setMaxListeners(0);

        // Send content information
        this.router.get('/api/content-update', async (ctx, next) => {

            console.log('content-update-requested');

            ctx.request.socket.setTimeout(0);
            ctx.req.socket.setNoDelay(true);
            ctx.req.socket.setKeepAlive(true);

            ctx.set({
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            });

            const stream = new PassThrough();
            ctx.status = 200;
            ctx.body = stream;

            stream.write(`data:${this.initialData}\n\n`);

            const listener = (data) => {
                console.log('update-sent');
                stream.write(`data:${data}\n\n`);
            }

            this.events.on('update', listener);

            stream.on('close', () => {
                console.log('update connection closed');
                this.events.off('update', listener);
            });
        });
    }
}
module.exports = ContentUpdateRouter;
