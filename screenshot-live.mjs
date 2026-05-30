import { chromium } from "@playwright/test";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto("https://brunaribeirosocialmedia-glitch.github.io/bmidia-site/", { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(3500);
await page.screenshot({ path: "live-hero.png", fullPage: false });

// Scroll para ver seções
await page.mouse.move(720, 450);
for (let i = 0; i < 8; i++) { await page.mouse.wheel(0, 200); await page.waitForTimeout(80); }
await page.waitForTimeout(1500);
await page.screenshot({ path: "live-metodo.png" });

for (let i = 0; i < 8; i++) { await page.mouse.wheel(0, 200); await page.waitForTimeout(80); }
await page.waitForTimeout(1500);
await page.screenshot({ path: "live-servicos.png" });

for (let i = 0; i < 10; i++) { await page.mouse.wheel(0, 200); await page.waitForTimeout(80); }
await page.waitForTimeout(1500);
await page.screenshot({ path: "live-bruna.png" });

await browser.close();
