const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const koaStatic = require('koa-static');
const path = require('path');
// const {faker} = require('@faker-js/faker');

// Middlewares
const corsMiddleware = require('./middlewares/cors-mw');

// Import services
const MessagesService = require('./services/messages-service');

// Import routers and controllers
const MessagesRouter = require('./routers/messages-router');
const FilesRouter = require('./routers/files-router');
const SseRouter = require('./routers/sse-router');
const WebSocketController = require("./routers/web-socket");

// Create services and bind them to routers
const messagesService = new MessagesService();
const messagesRouter = new MessagesRouter(messagesService);
const filesRouter = new FilesRouter(messagesService);
const sseRouter = new SseRouter(messagesService);

const app = new Koa(); // Server part

// Serve static
const publicFolder = path.join(__dirname, './public');
app.use(koaStatic(publicFolder));

// Add cors middleware and body processing options
app.use(corsMiddleware);
app.use(koaBody({
        text: true,
        urlencoded: true,
        multipart: true,
        json: true,
    }));

// Add routers
app
    .use(filesRouter.router.routes())
    .use(sseRouter.router.routes())
    .use(messagesRouter.router.routes());

// Init server
const PORT = process.env.PORT || '8080';
const server = http.createServer(app.callback());

// Init WebSocketController
const wss = new WebSocketController(server, messagesService);

// Start server
server.listen(PORT, () => console.log(`Listening on ${PORT}`));
