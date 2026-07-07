import { copyFile, mkdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = new URL('..', import.meta.url).pathname.replace(/\\$/,'');
const dist = join(root, 'dist');
const files = [
  'index.html',
  'manifest.json',
  'sw.js'
];
const copyDirs = [
  'assets'
];

async function copyDir(src, dest) {
  await mkdir(dest, { recursive: true });
  const entries = await import('node:fs/promises').then(fs => fs.readdir(src, { withFileTypes: true }));
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      await copyFile(srcPath, destPath);
    }
  }
}

async function build() {
  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });

  for (const file of files) {
    await copyFile(join(root, file), join(dist, file));
  }

  for (const dir of copyDirs) {
    await copyDir(join(root, dir), join(dist, dir));
  }

  console.log('Static site built to', dist);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});