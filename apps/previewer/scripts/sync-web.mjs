import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const appDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const webDir = path.resolve(appDir, '../web');
const overlayDir = path.join(appDir, 'overlay');

const MIRRORED = ['src', 'public', 'postcss.config.mjs', 'eslint.config.mjs'];

const EXCLUDED_PATHS = [
  'src/docs',
  'src/app/blog',
  'src/app/(developers)/api/og',
  'src/app/(developers)/api/docs/[slug]/invalidate',
  'src/app/(developers)/api/docs/[slug]/revalidate',
  'src/app/[locale]/(dashboard)',
  'src/app/[locale]/(main)/about',
  'src/app/[locale]/(main)/browse',
  'src/app/[locale]/(main)/report',
  'src/app/[locale]/(main)/(developers)/auth',
  'src/app/[locale]/(main)/(error)'
];
const EXCLUDED_FILES = /^src\/(instrumentation[^/]*|sentry\.[^/]*\.config)\.ts$/;

const watch = process.argv.includes('--watch');

function isExcluded(rel) {
  return (
    rel.split('/').some((segment) => segment.startsWith('.')) ||
    EXCLUDED_PATHS.some((p) => rel === p || rel.startsWith(`${p}/`)) ||
    EXCLUDED_FILES.test(rel)
  );
}

function collect(root, rel, out) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) {
    return;
  }
  if (fs.statSync(abs).isDirectory()) {
    for (const name of fs.readdirSync(abs)) {
      collect(root, rel ? `${rel}/${name}` : name, out);
    }
  } else {
    out.set(rel, abs);
  }
}

function desiredFiles() {
  const files = new Map();
  for (const entry of MIRRORED) {
    collect(webDir, entry, files);
  }
  for (const rel of files.keys()) {
    if (isExcluded(rel)) {
      files.delete(rel);
    }
  }
  for (const entry of MIRRORED) {
    collect(overlayDir, entry, files);
  }
  return files;
}

function isUpToDate(source, target) {
  if (!fs.existsSync(target)) {
    return false;
  }
  const a = fs.statSync(source);
  const b = fs.statSync(target);
  return a.size === b.size && Math.abs(a.mtimeMs - b.mtimeMs) < 1;
}

function removeStale(rel, desired) {
  const abs = path.join(appDir, rel);
  if (!fs.existsSync(abs)) {
    return;
  }
  if (fs.statSync(abs).isDirectory()) {
    for (const name of fs.readdirSync(abs)) {
      removeStale(`${rel}/${name}`, desired);
    }
    if (fs.readdirSync(abs).length === 0) {
      fs.rmdirSync(abs);
    }
  } else if (!desired.has(rel)) {
    fs.rmSync(abs);
  }
}

function sync() {
  const desired = desiredFiles();
  let copied = 0;

  for (const [rel, source] of desired) {
    const target = path.join(appDir, rel);
    if (isUpToDate(source, target)) {
      continue;
    }
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
    const { atime, mtime } = fs.statSync(source);
    fs.utimesSync(target, atime, mtime);
    copied++;
  }

  for (const entry of MIRRORED) {
    removeStale(entry, desired);
  }
  return copied;
}

function checkDependencies() {
  const read = (dir) => JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
  const web = read(webDir);
  const app = read(appDir);
  const appDeps = { ...app.dependencies, ...app.devDependencies };

  const mismatched = Object.entries({ ...web.dependencies, ...web.devDependencies })
    .filter(([name, version]) => appDeps[name] !== version)
    .map(([name, version]) => `  ${name}: web has ${version}, previewer has ${appDeps[name] ?? 'nothing'}`);

  if (mismatched.length > 0) {
    const message = `apps/previewer/package.json is out of sync with apps/web/package.json:\n${mismatched.join('\n')}`;
    if (!watch) {
      console.error(message);
      process.exit(1);
    }
    console.warn(message);
  }
}

checkDependencies();
console.log(`Synced web sources (${sync()} files updated)`);

if (watch) {
  const { watch: watchPaths } = await import('chokidar');
  let timer = null;

  watchPaths([...MIRRORED.map((entry) => path.join(webDir, entry)), overlayDir], { ignoreInitial: true }).on(
    'all',
    () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const copied = sync();
        if (copied > 0) {
          console.log(`Synced web sources (${copied} files updated)`);
        }
      }, 100);
    }
  );
}
