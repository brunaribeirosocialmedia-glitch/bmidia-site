import { chromium } from "@playwright/test";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", e => errors.push("PAGE ERROR: " + e.message));

await page.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(2500);
await page.screenshot({ path: "verify-hero.png" });

const cursorElements = await page.evaluate(() => document.querySelectorAll(".fixed.rounded-full").length);
console.log("cursor fixed elements:", cursorElements);

const heroLayers = await page.evaluate(() => {
  const hero = document.querySelector("section");
  return hero ? hero.querySelectorAll(".absolute").length : 0;
});
console.log("hero absolute layers:", heroLayers);

await page.evaluate(() => window.scrollTo({ top: 900, behavior: "instant" }));
await page.waitForTimeout(1500);
await page.screenshot({ path: "verify-metodo.png" });

const revealInfo = await page.evaluate(() => {
  const reveals = document.querySelectorAll(".gsap-reveal");
  const total = reveals.length;
  const visible = Array.from(reveals).filter(el => parseFloat(window.getComputedStyle(el).opacity) > 0).length;
  return { total, visible };
});
console.log("gsap-reveal elements:", JSON.stringify(revealInfo));

await page.evaluate(() => window.scrollTo({ top: 2200, behavior: "instant" }));
await page.waitForTimeout(1500);
await page.screenshot({ path: "verify-servicos.png" });

const cardCount = await page.evaluate(() => document.querySelectorAll(".servico-card").length);
console.log("servico-card wrappers:", cardCount);

await page.locator(".servico-card").first().hover();
await page.waitForTimeout(400);
await page.screenshot({ path: "verify-card-hover.png" });

await page.evaluate(() => window.scrollTo({ top: 4500, behavior: "instant" }));
await page.waitForTimeout(1200);
await page.screenshot({ path: "verify-sobre.png" });

console.log("Errors:", errors.length ? errors.join(" | ") : "none");
await browser.close();
