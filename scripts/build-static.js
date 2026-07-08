import { copyFile, mkdir, readdir, rm, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const dist = join(root, 'dist');
const files = ['index.html', 'manifest.json', 'sw.js'];
const copyDirs = ['assets'];

async function copyDir(src, dest) {
  await mkdir(dest, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });

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

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

function candidateRoots() {
  return [root, join(root, 'public'), join(root, 'backup_root_before_cleanup')];
}

function candidatesFor(file) {
  return candidateRoots().map((base) => join(base, file));
}

function candidatesForDir(dir) {
  return candidateRoots().map((base) => join(base, dir));
}

async function build() {
  const distReady = await Promise.all([
    exists(join(dist, 'index.html')),
    exists(join(dist, 'manifest.json')),
    exists(join(dist, 'sw.js')),
    exists(join(dist, 'assets'))
  ]);

  if (distReady.every(Boolean)) {
    console.log('Using existing dist output at', dist);
    return;
  }

  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });

  for (const file of files) {
    const cands = candidatesFor(file);
    let found = false;

    for (const src of cands) {
      if (await exists(src)) {
        await copyFile(src, join(dist, file));
        found = true;
        break;
      }
    }

    if (!found) {
      throw new Error(`Required file not found: ${file}. Tried: ${cands.join(', ')}`);
    }
  }

  for (const dir of copyDirs) {
    const cands = candidatesForDir(dir);
    let foundDir = null;

    for (const src of cands) {
      if (await exists(src)) {
        foundDir = src;
        break;
      }
    }

    if (foundDir) {
      await copyDir(foundDir, join(dist, dir));
    } else {
      console.warn(`Directory not found, skipping: ${dir}. Tried: ${cands.join(', ')}`);
    }
  }

  console.log('Static site built to', dist);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});