const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const ARTIFACTS_DIR = 'C:/Users/luigg/.gemini/antigravity/brain/6b5b4ae1-6e88-43bd-8884-70cd527f411d';
const PROJECT_DIR = 'c:/Users/luigg/Desktop/conectapro';
let appUrl = 'http://localhost:3005';
const port = '3005';

function checkServer() {
  return new Promise((resolve) => {
    const req = http.get(appUrl, (res) => {
      resolve(true);
    });
    req.on('error', () => {
      resolve(false);
    });
    req.end();
  });
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  let serverProcess = null;
  let startedServer = false;

  let isUp = await checkServer();
  if (!isUp) {
    serverProcess = spawn('npx', ['next', 'dev', '-p', port], {
      cwd: PROJECT_DIR,
      stdio: 'ignore',
      shell: true
    });
    startedServer = true;

    let attempts = 0;
    while (attempts < 45) {
      attempts++;
      await sleep(1000);
      isUp = await checkServer();
      if (isUp) break;
    }
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(90000);
    await page.setViewport({ width: 1280, height: 800 });

    await page.goto(`${appUrl}/auth/login`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('#email');
    await page.type('#email', 'francisco.blanco@conectapro-demo.com');
    await page.type('#pass', 'demo.francisco123');
    
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);

    await page.goto(`${appUrl}/profesional/ordenes/60d53d8e-0abc-47bc-a64e-2bab692eae2b`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('main button', { timeout: 15000 });
    await sleep(1500);

    const buttons = await page.$$('main button');
    let acceptBtn = null;
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && (text.includes('Aceptar Trabajo') || text.includes('Aceptar Orden'))) {
        acceptBtn = btn;
        break;
      }
    }

    if (acceptBtn) {
      await acceptBtn.click();
      await sleep(1500);
      
      const modalScreenshotPath = path.join(ARTIFACTS_DIR, 'screenshot_aceptar_orden_modal.png');
      await page.screenshot({ path: modalScreenshotPath });
      console.log(`✓ Screenshot saved successfully to: ${modalScreenshotPath}`);
    }

  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
    if (startedServer && serverProcess) {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', serverProcess.pid, '/f', '/t']);
      } else {
        serverProcess.kill();
      }
    }
  }
}

main();
