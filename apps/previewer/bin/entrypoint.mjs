#!/usr/bin/env node
import concurrently from 'concurrently';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pkg = JSON.parse(readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
console.log(`Starting Wiki previewer v${pkg.version}`);

// Resolve paths relative to where this bin file lives
const serverPath = path.join(__dirname, '../server.js');
const watcherPath = path.join(__dirname, 'watcher.mjs');

const { result, commands } = concurrently(
  [
    { command: `node ${serverPath}`, name: 'app', prefixColor: 'blue' },
    { command: `node ${watcherPath}`, name: 'watcher', prefixColor: 'green' }
  ],
  {
    prefix: 'name',
    killOthersOn: ['failure', 'success'],
    restartTries: 3,
    handleInput: true
  }
);

process.on('SIGINT', () => {
  console.log('\nStopping previewer...');
  commands.forEach((cmd) => cmd.kill('SIGINT'));
  process.exit(0);
});

result.then(
  () => process.exit(0),
  () => process.exit(1)
);
