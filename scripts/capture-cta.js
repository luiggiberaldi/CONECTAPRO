const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const ARTIFACTS_DIR = 'C:/Users/luigg/.gemini/antigravity/brain/6b5b4ae1-6e88-43bd-8884-70cd527f411d';
const PROJECT_DIR = 'c:/Users/luigg/Desktop/conectapro';
let appUrl = 'http://localhost:3005';

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

async function main() {
  let serverProcess = null;
  let startedServer = false;

  console.log('Checking if server is up...');
  let isUp = await checkServer();

  if (!isUp) {
    console.log(`Server not responding at ${appUrl}. Starting in background...`);
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

  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1080 });
    
    console.log('Navigating to landing page...');
    await page.goto(appUrl, { waitUntil: 'networkidle2' });
    await sleep(2000);

    // Scroll to the bottom CTA section
    console.log('Scrolling to CTA section...');
    await page.evaluate(() => {
      // Find the bottom CTA section
      const sections = document.querySelectorAll('section');
      for (const section of sections) {
        if (section.textContent.includes('¿Listo para comenzar a resolver o')) {
          section.scrollIntoView({ behavior: 'instant', block: 'center' });
          break;
        }
      }
    });
    await sleep(1500);

    const screenshotPath = path.join(ARTIFACTS_DIR, 'landing_cta_contrast.png');
    
    // Capture the CTA section element screenshot
    const ctaElement = await page.evaluateHandle(() => {
      const sections = document.querySelectorAll('section');
      for (const section of sections) {
        if (section.textContent.includes('¿Listo para comenzar a resolver o')) {
          return section;
        }
      }
      return null;
    });

    if (ctaElement.asElement()) {
      await ctaElement.asElement().screenshot({ path: screenshotPath });
      console.log(`✓ Saved CTA section screenshot to: ${screenshotPath}`);
    } else {
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`✓ Saved full page screenshot to: ${screenshotPath}`);
    }

  } catch (err) {
    console.error('Error:', err);
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
