// Run after generate-connection-sculpture.py. Requires system Chromium and Pillow.
import { createServer } from 'vite';
import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { unlinkSync } from 'node:fs';
const server = await createServer({ server: { host: '127.0.0.1', port: 5183, strictPort: true }, logLevel: 'error' });
await server.listen();
let browser;
try {
  browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1000, height: 480 } });
  await page.goto('http://127.0.0.1:5183/sculpture/hyperchat-connection.svg');
  await page.screenshot({ path: '/tmp/hyperchat-connection-render.png', omitBackground: true });
  execFileSync('python3', ['-c', "from PIL import Image; Image.open('/tmp/hyperchat-connection-render.png').save('public/sculpture/hyperchat-connection.webp', quality=90, method=6)"]);
  unlinkSync('public/sculpture/hyperchat-connection.svg');
} finally { await browser?.close(); await server.close(); }
