import { chromium } from "@playwright/test";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const failed = [];
page.on("requestfailed", req => failed.push({ url: req.url().substring(0, 120), reason: req.failure()?.errorText }));
page.on("response", res => { if (res.status() >= 400) failed.push({ url: res.url().substring(0, 120), status: res.status() }); });

await page.goto("https://brunaribeirosocialmedia-glitch.github.io/bmidia-site/", { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(2000);

console.log("Failed/404 resources:");
failed.forEach(f => console.log(JSON.stringify(f)));

// Verifica se CSS carregou
const cssLoaded = await page.evaluate(() => {
  const testEl = document.createElement("div");
  testEl.className = "bg-indigo";
  document.body.appendChild(testEl);
  const bg = window.getComputedStyle(testEl).backgroundColor;
  testEl.remove();
  return bg;
});
console.log("bg-indigo computed:", cssLoaded);

// Verifica se o body tem background escuro
const bodyBg = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
console.log("body background:", bodyBg);

await browser.close();
