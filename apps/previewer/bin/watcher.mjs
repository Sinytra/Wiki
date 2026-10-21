import { WebSocketServer } from 'ws';
import chokidar from 'chokidar';

const PORT = 3100;
const wss = new WebSocketServer({ port: PORT });

wss.on('listening', () => console.log(`WebSocket watcher started on ws://localhost:${PORT}`));
wss.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.warn(`Port ${PORT} is already in use, likely by another previewer. Live reload is disabled.`);
        process.exit(0);
    }
    throw e;
});

const paths = (process.env.LOCAL_DOCS_ROOTS || '').split(';');
const empty = paths.length === 0 || paths.length === 1 && paths[0].length === 0;

if (!empty) {
    console.debug('Watching paths', paths);

    chokidar.watch(paths).on('change', (event, path) => {
        console.debug(`File ${event} changed`);

        wss.clients.forEach((client) => {
            if (client.readyState === 1) {
                client.send('refresh');
            }
        });
    });
} else {
    console.debug('No patchs to watch found');
}