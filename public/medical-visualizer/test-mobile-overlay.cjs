const { chromium, devices } = require('playwright');

(async () => {
  const browser = await chromium.launch();

  // Mobile check
  const mctx = await browser.newContext({ ...devices['iPhone 13'] });
  const mpage = await mctx.newPage();
  const merrors = [];
  mpage.on('pageerror', (e) => merrors.push(e.message));
  await mpage.goto('http://localhost:4325/', { waitUntil: 'networkidle' });
  await mpage.waitForTimeout(500);

  await mpage.click('[data-env="rain"]');
  await mpage.waitForTimeout(600);
  const shot1 = await mpage.evaluate(() => {
    const el = document.getElementById('weather-changing-overlay');
    return { visible: el.classList.contains('visible'), display: getComputedStyle(el).display, opacity: getComputedStyle(el).opacity };
  });
  console.log('mobile overlay during transition:', JSON.stringify(shot1));
  await mpage.screenshot({ path: 'C:/dev/Portfolio/Website Portfolio/public/medical-visualizer/mobile-overlay.png' });

  await mpage.waitForTimeout(15000);
  const shot2 = await mpage.evaluate(() => {
    const el = document.getElementById('weather-changing-overlay');
    return { visible: el.classList.contains('visible') };
  });
  console.log('mobile overlay after transition:', JSON.stringify(shot2));
  console.log('mobile errors:', JSON.stringify(merrors));
  await mctx.close();

  // Desktop check — 3D text still works, mobile overlay stays hidden/unused
  const dctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const dpage = await dctx.newPage();
  const derrors = [];
  dpage.on('pageerror', (e) => derrors.push(e.message));
  await dpage.goto('http://localhost:4325/', { waitUntil: 'networkidle' });
  await dpage.waitForTimeout(500);
  await dpage.click('[data-env="rain"]');
  await dpage.waitForTimeout(1500);
  const overlayDisplay = await dpage.evaluate(() => getComputedStyle(document.getElementById('weather-changing-overlay')).display);
  console.log('desktop overlay display (should be none):', overlayDisplay);
  await dpage.screenshot({ path: 'C:/dev/Portfolio/Website Portfolio/public/medical-visualizer/desktop-3d.png' });
  console.log('desktop errors:', JSON.stringify(derrors));
  await dctx.close();

  await browser.close();
})();
