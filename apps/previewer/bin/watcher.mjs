import { WebSocketServer } from 'ws';
import chokidar from 'chokidar';

const wss = new WebSocketServer({ port: 3100 });

console.log('WebSocket watcher started on ws://localhost:3100');

const paths = (process.env.LOCAL_DOCS_ROOTS || '').split(',');
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