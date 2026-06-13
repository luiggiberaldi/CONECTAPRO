const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

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

  console.log('Comprobando si el servidor de desarrollo está activo...');
  let isUp = await checkServer();

  if (!isUp) {
    console.log(`El servidor no responde en ${appUrl}. Levantando servidor Next.js en segundo plano...`);
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
        console.log('¡Servidor levantado exitosamente!');
        break;
      }
      if (attempts % 5 === 0) {
        console.log(`Esperando a que el servidor Next.js responda (intento ${attempts}/45)...`);
      }
    }

    if (!isUp) {
      console.error('Error: El servidor Next.js no respondió a tiempo.');
      if (serverProcess) serverProcess.kill();
      process.exit(1);
    }
  } else {
    console.log('El servidor ya está activo.');
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

    console.log('Navegando a la página de login...');
    await page.goto(`${appUrl}/auth/login`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('#email', { timeout: 25000 });

    console.log('Ingresando credenciales del administrador...');
    await page.type('#email', 'admin@conectapro.com');
    await page.type('#pass', 'admin.password123');
    
    console.log('Haciendo clic en el botón de ingresar...');
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);

    console.log('Login exitoso. Redirigido a:', page.url());

    if (!fs.existsSync(ARTIFACTS_DIR)) {
      fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
    }

    // 2. Captura: Panel de Usuarios
    console.log('Navegando a Gestión de Usuarios...');
    await page.goto(`${appUrl}/admin/usuarios`, { waitUntil: 'networkidle2' });
    
    console.log('Esperando que cargue la tabla de usuarios...');
    await page.waitForSelector('table tbody tr:first-child', { timeout: 30000 });
    await sleep(1000);

    console.log('Tomando captura de la Tabla de Usuarios...');
    const usersPath = path.join(ARTIFACTS_DIR, 'screenshot_usuarios_table.png');
    await page.screenshot({ path: usersPath });
    console.log(`✓ Tabla de usuarios guardada en: ${usersPath}`);

    // Abrir Drawer de Usuario
    console.log('Abriendo Drawer de detalle de usuario...');
    const eyeButtonSelector = 'table tbody tr:first-child button';
    const hasEyeButton = await page.$(eyeButtonSelector) !== null;
    
    if (hasEyeButton) {
      const buttons = await page.$$('table tbody tr:first-child button');
      let clicked = false;
      for (const btn of buttons) {
        const title = await page.evaluate(el => el.getAttribute('title'), btn);
        if (title && title.includes('Ver ficha')) {
          await btn.click();
          clicked = true;
          break;
        }
      }
      if (!clicked && buttons.length > 0) {
        await buttons[0].click();
      }
      
      await sleep(1500); // Esperar la transición del drawer

      console.log('Tomando captura del Drawer del Usuario...');
      const drawerPath = path.join(ARTIFACTS_DIR, 'screenshot_usuario_drawer.png');
      await page.screenshot({ path: drawerPath });
      console.log(`✓ Drawer de usuario guardado en: ${drawerPath}`);

      console.log('Cerrando el drawer...');
      const backdropSelector = 'div.fixed.inset-0';
      if (await page.$(backdropSelector) !== null) {
        await page.click(backdropSelector);
        await sleep(500);
      }
    }
  } catch (err) {
    console.error('Error durante la automatización de capturas:', err);
  } finally {
    console.log('Cerrando Puppeteer...');
    await browser.close();

    if (startedServer && serverProcess) {
      console.log('Deteniendo el servidor de desarrollo...');
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', serverProcess.pid, '/f', '/t']);
      } else {
        serverProcess.kill();
      }
      console.log('Servidor detenido.');
    }
    console.log('--- Proceso Finalizado ---');
  }
}

main();
