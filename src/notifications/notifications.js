const Router = require('@koa/router');

const router = new Router();

router.get('/api/notifications', (ctx, next) => {
    ctx.response.body = 'Test - Notifications Service';
});

module.exports = router;
