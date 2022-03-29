window.onload = () => {
    // WEB SOCKETS init and operations
    let socket;

    // Pick-up page elements
    const messageName = document.getElementById('message-name');
    const messageData = document.getElementById('message-data');
    const sendButton = document.getElementById('send');
    const startSocket = document.getElementById('start-socket')
    const socketReply = document.getElementById('socket-reply');

    // Create socket connection
    startSocket.addEventListener('click', () => {
        initWS(socket);
    });

    function initWS(ws) {
        ws = new WebSocket('ws://localhost:8080');

        // Sender
        sendButton.addEventListener('click', () => {
            const data = {
                name: messageName.value,
                data: messageData.value,
                type: 'text',
            }
            ws.send(JSON.stringify(data));
        });

        // Receivers
        ws.addEventListener('message', (e) => {
            socketReply.innerText = e.data;
        });

        // Standard routes
        ws.addEventListener('open', () => {
            console.log('connected');
        });
        ws.addEventListener('close', (evt) => {
            console.log('connection closed', evt);
        });
        ws.addEventListener('error', () => {
            console.log('server error');
        });
    }

    // SSE operations
    const sseStartButton = document.getElementById('start-sse');
    const seeServerReply = document.getElementById('sse-reply');
    let eventSource;

    sseStartButton.addEventListener('click', () => {
        eventSource = new EventSource("http://localhost:8080/api/notifications/sse");

        eventSource.addEventListener('message', (evt) => {
            seeServerReply.innerText += evt.data;
        });
        eventSource.addEventListener('open', (evt) => {
            console.log('connected');
        });
        eventSource.addEventListener('error', (evt) => {
            console.log('error');
        });
    })
};
