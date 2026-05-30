import { chromium } from "@playwright/test";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on("pageerror", e => errors.push("PAGEERROR: " + e.message));
page.on("console", m => { if (m.type() === "error") errors.push("CONSOLE: " + m.text()); });

await page.goto("https://brunaribeirosocialmedia-glitch.github.io/bmidia-site/", { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(5000);

const dom = await page.evaluate(() => ({
  bodyBg: window.getComputedStyle(document.body).backgroundColor,
  bodyText: document.body.innerText ? document.body.innerText.substring(0, 300) : "EMPTY",
  gsapReveals: document.querySelectorAll(".gsap-reveal").length,
  gsapRevealVisible: [].filter.call(document.querySelectorAll(".gsap-reveal"), function(el) {
    return parseFloat(window.getComputedStyle(el).opacity) > 0;
  }).length,
  h1Text: document.querySelector("h1") ? document.querySelector("h1").textContent.substring(0, 40) : "NOT FOUND",
  h1Opacity: document.querySelector("h1") ? window.getComputedStyle(document.querySelector("h1")).opacity : null,
  mainSections: document.querySelectorAll("main > *").length,
}));

console.log("DOM:", JSON.stringify(dom, null, 2));
console.log("Errors:", errors.length ? errors.join("\n") : "NONE");

// Simular scroll e checar se reveals disparam
await page.mouse.move(720, 450);
for (var i = 0; i < 10; i++) { await page.mouse.wheel(0, 200); await page.waitForTimeout(100); }
await page.waitForTimeout(2000);

const afterScroll = await page.evaluate(() => ({
  scrollY: window.scrollY,
  visible: [].filter.call(document.querySelectorAll(".gsap-reveal"), function(el) {
    return parseFloat(window.getComputedStyle(el).opacity) > 0;
  }).length,
}));
console.log("After scroll:", JSON.stringify(afterScroll));

await browser.close();
