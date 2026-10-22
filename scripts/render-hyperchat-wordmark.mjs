// Render real typography into the local image sampled by the liquid engine.
import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';
const font = await readFile('node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2');
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
try {
  const page = await browser.newPage({ viewport: { width: 1000, height: 220 }, deviceScaleFactor: 2 });
  await page.setContent(`<style>@font-face{font-family:Brand;src:url(data:font/woff2;base64,${font.toString('base64')});font-weight:100 900}html,body{margin:0;background:transparent}canvas{display:block}</style><canvas width="2000" height="440" style="width:1000px;height:220px"></canvas>`);
  await page.evaluate(async () => {
    await document.fonts.load('900 180px Brand');
    const ctx = document.querySelector('canvas').getContext('2d');
    ctx.scale(2, 2);
    ctx.font = '900 180px Brand';
    const text = 'HYPERCHAT';
    const bounds = ctx.measureText(text);
    const scale = 960 / bounds.width;
    ctx.translate(20, 110 + (bounds.actualBoundingBoxAscent - bounds.actualBoundingBoxDescent) * scale / 2);
    ctx.scale(scale, scale);
    ctx.fillStyle = '#8C847B';
    ctx.fillText(text, 0, 0);
  });
  await page.screenshot({ path: '/tmp/hyperchat-wordmark.png', omitBackground: true });
} finally { await browser.close(); }
