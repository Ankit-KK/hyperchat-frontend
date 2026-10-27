// Optional authoring tool. Generated PNG is committed; production builds need no browser.
import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';
const display = await readFile('src/assets/fonts/FastelarDemoRegular-lx4oV.ttf');
const inter = await readFile('node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2');
const browser = await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium',args:['--no-sandbox']});
try {
  const page = await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
  await page.setContent(`<style>
    @font-face{font-family:Display;src:url(data:font/ttf;base64,${display.toString('base64')})}
    @font-face{font-family:Inter;src:url(data:font/woff2;base64,${inter.toString('base64')});font-weight:100 900}
    *{box-sizing:border-box}body{margin:0;background:#221f1c;color:#f3ede2;font-family:Inter;padding:44px 60px}
    header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #8c847b66;padding-bottom:25px}
    .brand{font-size:34px;font-weight:650;letter-spacing:-2px}.eyebrow{font-size:12px;letter-spacing:2px;color:#d7cbb9}
    main{display:flex;justify-content:space-between;align-items:center;padding-top:40px}
    h1{font-family:Display,Georgia,serif;font-size:87px;font-weight:400;line-height:1.04;letter-spacing:-3px;margin:0}h1 span{color:#d3a475}
    aside{width:240px;padding-top:10px}aside div{padding:18px 0;border-bottom:1px solid #8c847b66;display:flex;gap:24px;font-size:17px}aside small{color:#d3a475;font-size:12px}
    footer{position:absolute;left:60px;right:60px;bottom:42px;display:flex;justify-content:space-between;font-size:12px;color:#d7cbb9}footer strong{font-weight:400;color:#f3ede2}
    </style><header><div class="brand">hyperchat</div><span class="eyebrow">LIVE CREATOR INTERACTIONS</span></header>
    <main><h1>Your stream.<br>Their voice.<br><span>A shared moment.</span></h1><aside><div><small>01</small>Text & TTS</div><div><small>02</small>Recorded voice</div><div><small>03</small>Sounds & media</div><div><small>04</small>Creator control</div></aside></main>
    <footer><span>Your audience. Your stream. <strong>HyperChat.</strong></span><span>A product of Streamheart Private Limited</span></footer>`);
  await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:'public/social/hyperchat-og.png'});
} finally {await browser.close();}
