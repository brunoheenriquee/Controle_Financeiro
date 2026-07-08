import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

test('build-static.js completes when the app sources are available at the project root', () => {
  const output = execFileSync(process.execPath, [join(rootDir, 'scripts', 'build-static.js')], {
    cwd: rootDir,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  });

  assert.match(output, /(Static site built|Using existing dist output at)/);
});
