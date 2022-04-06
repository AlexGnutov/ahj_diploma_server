const Router = require('@koa/router');

class NotificationRouter {
    constructor(NotificationService) {
        this.router = new Router();
        this.notificationService = NotificationService;

        // Send content information
        this.router.get('/api/notifications', async (ctx) => {
            ctx.response.body = this.notificationService.getAll();
        });

        this.router.post('/api/notifications', async (ctx) => {
            const notificationData = ctx.request.body;
            ctx.response.body = this.notificationService.createOne(notificationData);
        });

        this.router.get('/api/notifications/delete', async (ctx) => {
            const { id } = ctx.request.query;
            ctx.response.body = this.notificationService.deleteOne(id);
        });
    }
}
module.exports = NotificationRouter;
