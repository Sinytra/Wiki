import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const appDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(appDir, 'dist');
const standaloneDir = path.join(appDir, '.next/standalone');

const PACKAGE_NAME = '@sinytra/wiki-previewer';
const RUNTIME_DEPENDENCIES = [
  'concurrently',
  'chokidar',
  'ws',
  'next',
  'react',
  'react-dom',
  'require-in-the-middle',
  'import-in-the-middle',
  '@sinytra/wiki-wasm'
];

function findServerDir(dir) {
  if (fs.existsSync(path.join(dir, 'server.js'))) {
    return dir;
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      const found = findServerDir(path.join(dir, entry.name));
      if (found) {
        return found;
      }
    }
  }
  return null;
}

function gitVersion() {
  try {
    const described = execSync('git describe --tags --long --match "v[0-9]*.[0-9]*"', {
      cwd: appDir,
      stdio: ['ignore', 'pipe', 'ignore']
    })
      .toString()
      .trim();
    const match = described.match(/^v?(\d+\.\d+)\.\d+-(\d+)-g/);
    return match ? `${match[1]}.${match[2]}` : null;
  } catch {
    return null;
  }
}

function resolveVersion(name, spec) {
  if (!/^(file|link|workspace):/.test(spec)) {
    return spec;
  }
  const installed = JSON.parse(fs.readFileSync(path.join(appDir, 'node_modules', name, 'package.json'), 'utf8'));
  return `^${installed.version}`;
}

const serverDir = fs.existsSync(standaloneDir) ? findServerDir(standaloneDir) : null;
if (!serverDir) {
  console.error('No standalone server found, run next build');
  process.exit(1);
}

fs.rmSync(distDir, { recursive: true, force: true });
fs.cpSync(serverDir, distDir, {
  recursive: true,
  verbatimSymlinks: true,
  filter: (source) => path.basename(source) !== 'node_modules' && !path.basename(source).startsWith('.env')
});
fs.cpSync(path.join(appDir, 'public'), path.join(distDir, 'public'), { recursive: true });
fs.cpSync(path.join(appDir, '.next/static'), path.join(distDir, '.next/static'), { recursive: true });
fs.cpSync(path.join(appDir, 'bin'), path.join(distDir, 'bin'), { recursive: true });

const pkg = JSON.parse(fs.readFileSync(path.join(appDir, 'package.json'), 'utf8'));
const dependencies = Object.fromEntries(
  RUNTIME_DEPENDENCIES.filter((name) => pkg.dependencies[name]).map((name) => [
    name,
    resolveVersion(name, pkg.dependencies[name])
  ])
);

const { scripts: _scripts, devDependencies: _devDependencies, private: _private, ...rest } = pkg;
const distPkg = {
  ...rest,
  name: PACKAGE_NAME,
  version: gitVersion() ?? pkg.version,
  dependencies
};
fs.writeFileSync(path.join(distDir, 'package.json'), `${JSON.stringify(distPkg, null, 2)}\n`);

console.log(`Packaged ${PACKAGE_NAME}@${distPkg.version} into ${path.relative(process.cwd(), distDir) || '.'}`);
