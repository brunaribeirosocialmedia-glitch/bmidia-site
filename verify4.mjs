import { chromium } from "@playwright/test";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto("http://localhost:3000", { waitUntil: "load" });
await page.waitForTimeout(3000);

// Simulate real user scroll via mouse wheel (works with Lenis)
await page.mouse.move(720, 450);
for (let i = 0; i < 15; i++) {
  await page.mouse.wheel(0, 200);
  await page.waitForTimeout(80);
}
await page.waitForTimeout(2000);

const afterScroll = await page.evaluate(() => ({
  scrollY: window.scrollY,
  gsapVisible: Array.from(document.querySelectorAll(".gsap-reveal"))
    .filter(el => parseFloat(window.getComputedStyle(el).opacity) > 0.5).length,
  totalGsap: document.querySelectorAll(".gsap-reveal").length,
}));
console.log("After wheel scroll:", JSON.stringify(afterScroll));

// Check if counter-up has fired (numbers should be > 00 if ScrollTrigger fired)
const counterVals = await page.evaluate(() =>
  Array.from(document.querySelectorAll("[data-counter]")).map(el => el.textContent)
);
console.log("Counter values:", counterVals);

// Check 3D card transform when mouse is over card
const cardBounds = await page.evaluate(() => {
  const cards = document.querySelectorAll(".servico-card > div");
  return Array.from(cards).slice(0,2).map(c => {
    const r = c.getBoundingClientRect();
    return { top: Math.round(r.top), left: Math.round(r.left), width: Math.round(r.width) };
  });
});
console.log("Card positions:", JSON.stringify(cardBounds));

// Take screenshot after scroll (to try capture content)
await page.screenshot({ path: "verify-scrolled.png", type: "jpeg", quality: 90 });

// Try to get pixel colors at expected content areas
const pixels = await page.evaluate(() => {
  const canvas = document.createElement("canvas");
  canvas.width = 1440;
  canvas.height = 900;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "canvas not available";
  return "canvas available";
});
console.log("Canvas:", pixels);

await browser.close();
