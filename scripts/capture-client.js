const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

const ARTIFACTS_DIR = 'C:/Users/luigg/.gemini/antigravity/brain/6b5b4ae1-6e88-43bd-8884-70cd527f411d';
const PROJECT_DIR = path.resolve(__dirname, '..');
let appUrl = 'http://localhost:3005';

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

  console.log('Comprobando si el servidor está activo...');
  let isUp = await checkServer();

  if (!isUp) {
    console.log(`El servidor no responde en ${appUrl}. Levantando en segundo plano...`);
    serverProcess = spawn('npm', ['run', 'start', '--', '-p', '3005'], {
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
      if (isUp) {
        console.log('¡Servidor levantado!');
        break;
      }
    }

    if (!isUp) {
      console.error('El servidor no respondió a tiempo.');
      if (serverProcess) serverProcess.kill();
      process.exit(1);
    }
  }

  console.log('Iniciando Puppeteer...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(90000);
    await page.setViewport({ width: 1440, height: 900 });

    console.log('Iniciando sesión como Maria Gomez (cliente)...');
    await page.goto(`${appUrl}/auth/login`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('#email', { timeout: 25000 });
    await page.type('#email', 'maria.gomez@conectapro-demo.com');
    await page.type('#pass', 'demo.maria123');

    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);

    console.log('Login exitoso. Redirigido a:', page.url());
    await sleep(2000);

    const clientDashPath = path.join(ARTIFACTS_DIR, 'screenshot_cliente_dashboard.png');
    await page.screenshot({ path: clientDashPath });
    console.log(`✓ Captura guardada en: ${clientDashPath}`);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
    if (startedServer && serverProcess) {
      console.log('Deteniendo servidor...');
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', serverProcess.pid, '/f', '/t']);
      } else {
        serverProcess.kill();
      }
    }
    console.log('--- Finalizado ---');
  }
}

main();
