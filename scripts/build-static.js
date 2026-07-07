import { copyFile, mkdir, rm, stat } from 'node:fs/promises';
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

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch (e) {
    return false;
  }
}

function candidatesFor(file) {
  // prefer root, then public, then backup
  return [
    join(root, file),
    join(root, 'public', file),
    join(root, 'backup_root_before_cleanup', file)
  ];
}

function candidatesForDir(dir) {
  return [
    join(root, dir),
    join(root, 'public', dir),
    join(root, 'backup_root_before_cleanup', dir)
  ];
}

async function build() {
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
      // not fatal, but warn
      console.warn(`Directory not found, skipping: ${dir}. Tried: ${cands.join(', ')}`);
    }
  }

  console.log('Static site built to', dist);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});