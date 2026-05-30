import { chromium } from "@playwright/test";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto("https://brunaribeirosocialmedia-glitch.github.io/bmidia-site/", { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(3500);

// Verifica se o deploy chegou (checa conteúdo real)
const content = await page.evaluate(() => ({
  h1: document.querySelector("h1")?.textContent?.trim().substring(0, 40),
  h1Opacity: document.querySelector("h1") ? window.getComputedStyle(document.querySelector("h1")).opacity : null,
  lenisActive: window.getComputedStyle(document.body).overflow,
  gsapReveals: document.querySelectorAll(".gsap-reveal").length,
  title: document.title,
}));
console.log("Live site DOM:", JSON.stringify(content, null, 2));

// Screenshot com fundo branco forçado para ver conteúdo
await page.evaluate(() => {
  // Adicionar um div de debug visível
  document.body.style.backgroundColor = "#040022";
});

// Full page screenshot
await page.screenshot({ path: "live-full.png", fullPage: true, type: "jpeg", quality: 95 });

// Tenta screenshot com elementos específicos visíveis
const h1Bounds = await page.evaluate(() => {
  const h1 = document.querySelector("h1");
  if (!h1) return null;
  const r = h1.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height, color: window.getComputedStyle(h1).color };
});
console.log("H1 bounds:", h1Bounds);

await browser.close();
