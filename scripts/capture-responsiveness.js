const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');
const { createClient } = require('@supabase/supabase-js');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const ARTIFACTS_DIR = 'C:/Users/luigg/.gemini/antigravity/brain/6b5b4ae1-6e88-43bd-8884-70cd527f411d';
const PROJECT_DIR = path.resolve(__dirname, '..');
let appUrl = 'http://localhost:3005';

// Read URL of the app from .env.local
try {
  const envPath = path.resolve(PROJECT_DIR, '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('NEXT_PUBLIC_APP_URL=')) {
        appUrl = trimmed.split('=')[1].trim().replace(/^['"]|['"]$/g, '');
      }
    });
  }
} catch (e) {
  console.log('Could not read .env.local, using default:', appUrl);
}

const urlObj = new URL(appUrl);
const port = urlObj.port || '3005';

// Check if dev server is up
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

// Retrieve DB info for fetching a real order ID
function getSupabaseClient() {
  const envPath = path.resolve(PROJECT_DIR, '.env.local');
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const parts = trimmed.split('=');
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
    env[key] = val;
  });
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
}

const viewports = {
  mobile: { width: 375, height: 812, isMobile: true, hasTouch: true },
  tablet: { width: 768, height: 1024, isMobile: true, hasTouch: true },
  desktop: { width: 1440, height: 900, isMobile: false, hasTouch: false }
};

async function main() {
  let serverProcess = null;
  let startedServer = false;

  console.log('Checking if server is up...');
  let isUp = await checkServer();

  if (!isUp) {
    console.log(`Server not responding at ${appUrl}. Starting in background...`);
    serverProcess = spawn('npm', ['run', 'start', '--', '-p', port], {
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
        console.log('Server is ready!');
        break;
      }
    }

    if (!isUp) {
      console.error('Server failed to start.');
      if (serverProcess) serverProcess.kill();
      process.exit(1);
    }
  }

  // Get a real order ID
  let sampleOrderId = 'dummy-id';
  try {
    const supabase = getSupabaseClient();
    const { data: orders } = await supabase.from('ordenes').select('id').limit(1);
    if (orders && orders.length > 0) {
      sampleOrderId = orders[0].id;
      console.log('Found sample order ID:', sampleOrderId);
    }
  } catch (err) {
    console.log('Could not fetch sample order ID from Supabase, using fallback.');
  }

  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const outputDir = path.join(ARTIFACTS_DIR, 'responsiveness');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const capturePage = async (page, name, urlSuffix) => {
    const fullUrl = `${appUrl}${urlSuffix}`;
    console.log(`Navigating to: ${fullUrl}`);
    await page.goto(fullUrl, { waitUntil: 'networkidle2' });
    await sleep(2000); // Give transitions/data loading time to finish

    for (const [vpName, vp] of Object.entries(viewports)) {
      await page.setViewport(vp);
      await sleep(1000); // Let layout adapt to resizing
      const screenshotPath = path.join(outputDir, `${name}_${vpName}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`  ✓ Saved ${vpName} screenshot to: ${screenshotPath}`);
    }
  };

  try {
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(90000);

    // 1. PUBLIC PAGES
    console.log('--- PUBLIC PAGES ---');
    await capturePage(page, 'landing', '/');
    await capturePage(page, 'login', '/auth/login');
    await capturePage(page, 'registro', '/auth/registro');

    // 2. CLIENTE ROLE
    console.log('--- CLIENTE PAGES ---');
    await page.goto(`${appUrl}/auth/login`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('#email');
    await page.type('#email', 'maria.gomez@conectapro-demo.com');
    await page.type('#pass', 'demo.maria123');
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);
    console.log('Logged in as Client');
    
    await capturePage(page, 'cliente_ordenes', '/cliente/ordenes');
    await capturePage(page, 'cliente_nueva_orden', '/cliente/ordenes/nueva');
    if (sampleOrderId && sampleOrderId !== 'dummy-id') {
      await capturePage(page, 'cliente_orden_detalle', `/cliente/ordenes/${sampleOrderId}`);
    }

    // Logout Client
    console.log('Logging out client...');
    await page.goto(`${appUrl}/auth/login`); // Navigate back to trigger routing to login or clear cookies
    const cookies = await page.cookies();
    await page.deleteCookie(...cookies);

    // 3. PROFESIONAL ROLE
    console.log('--- PROFESIONAL PAGES ---');
    await page.goto(`${appUrl}/auth/login`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('#email');
    await page.type('#email', 'francisco.blanco@conectapro-demo.com');
    await page.type('#pass', 'demo.francisco123');
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);
    console.log('Logged in as Professional');

    await capturePage(page, 'profesional_ordenes', '/profesional/ordenes');
    await capturePage(page, 'profesional_reputacion', '/profesional/reputacion');
    await capturePage(page, 'profesional_wallet', '/profesional/wallet');
    if (sampleOrderId && sampleOrderId !== 'dummy-id') {
      await capturePage(page, 'profesional_orden_detalle', `/profesional/ordenes/${sampleOrderId}`);
    }

    // Logout Professional
    console.log('Logging out professional...');
    await page.goto(`${appUrl}/auth/login`);
    const cookiesProf = await page.cookies();
    await page.deleteCookie(...cookiesProf);

    // 4. ADMIN ROLE
    console.log('--- ADMIN PAGES ---');
    await page.goto(`${appUrl}/auth/login`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('#email');
    await page.type('#email', 'admin@conectapro.com');
    await page.type('#pass', 'admin.password123');
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);
    console.log('Logged in as Admin');

    await capturePage(page, 'admin_dashboard', '/admin');
    await capturePage(page, 'admin_usuarios', '/admin/usuarios');
    await capturePage(page, 'admin_recargas', '/admin/recargas');
    await capturePage(page, 'admin_ordenes', '/admin/ordenes');

  } catch (err) {
    console.error('Error in responsiveness audit:', err);
  } finally {
    console.log('Closing browser...');
    await browser.close();
    if (startedServer && serverProcess) {
      console.log('Stopping dev server...');
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', serverProcess.pid, '/f', '/t']);
      } else {
        serverProcess.kill();
      }
    }
    console.log('Done!');
  }
}

main();
