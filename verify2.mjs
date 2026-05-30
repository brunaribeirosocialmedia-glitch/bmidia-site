import { chromium } from "@playwright/test";

const browser = await chromium.launch({ headless: false, args: ["--start-maximized"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on("console", m => {
  if (m.type() === "error") errors.push(m.text());
  if (m.type() === "warning" && m.text().includes("gsap")) console.log("GSAP WARN:", m.text());
});
page.on("pageerror", e => errors.push("PAGE ERROR: " + e.message));

await page.goto("http://localhost:3000", { waitUntil: "load", timeout: 30000 });
await page.waitForTimeout(4000); // wait for all entrance animations

// Check text content exists in DOM
const heroText = await page.evaluate(() => {
  const h1 = document.querySelector("h1");
  return h1 ? h1.textContent?.trim() : "NOT FOUND";
});
console.log("Hero h1 text:", heroText);

// Check opacity of hero elements
const heroOpacities = await page.evaluate(() => {
  const logo = document.querySelector("img[alt='B Mídia']");
  const h1 = document.querySelector("h1");
  const subline = document.querySelector("h1 + p") || document.querySelectorAll("p")[0];
  return {
    logo: logo ? window.getComputedStyle(logo).opacity : "not found",
    h1: h1 ? window.getComputedStyle(h1).opacity : "not found",
    subline: subline ? window.getComputedStyle(subline).opacity : "not found",
  };
});
console.log("Hero element opacities:", JSON.stringify(heroOpacities));

// Check WordReveal spans
const clipPaths = await page.evaluate(() => {
  const spans = document.querySelectorAll("h1 span span");
  return Array.from(spans).slice(0, 6).map(s => ({
    text: s.textContent,
    clip: window.getComputedStyle(s).clipPath,
  }));
});
console.log("WordReveal clip states:", JSON.stringify(clipPaths));

// Check Lenis is active
const lenisActive = await page.evaluate(() => {
  return {
    scrollY: window.scrollY,
    hasLenisClass: document.documentElement.hasAttribute("data-lenis-prevent"),
    bodyOverflow: window.getComputedStyle(document.body).overflow,
  };
});
console.log("Lenis info:", JSON.stringify(lenisActive));

// Screenshot with full animations done
await page.screenshot({ path: "verify-hero-full.png", fullPage: false });

// Check GSAP reveal items
const gsapState = await page.evaluate(() => {
  const items = document.querySelectorAll(".gsap-reveal");
  const allOpacities = Array.from(items).map(el => parseFloat(window.getComputedStyle(el).opacity));
  return {
    total: items.length,
    opacityAbove0: allOpacities.filter(o => o > 0).length,
    sample: allOpacities.slice(0, 5),
  };
});
console.log("GSAP reveal state:", JSON.stringify(gsapState));

// Scroll to Metodo section
await page.evaluate(() => window.scrollTo({ top: 1000, behavior: "instant" }));
await page.waitForTimeout(2000);
await page.screenshot({ path: "verify-metodo-full.png" });

const metodoNums = await page.evaluate(() => {
  const nums = document.querySelectorAll("[data-counter]");
  return Array.from(nums).map(el => ({
    text: el.textContent,
    counter: el.getAttribute("data-counter"),
  }));
});
console.log("Counter-up els:", JSON.stringify(metodoNums));

// Scroll to Servicos
await page.evaluate(() => window.scrollTo({ top: 2400, behavior: "instant" }));
await page.waitForTimeout(2000);
await page.screenshot({ path: "verify-servicos-full.png" });

// Hover over a service card for 3D effect
await page.mouse.move(720, 450);
await page.waitForTimeout(500);
const cardTransform = await page.evaluate(() => {
  const card = document.querySelector(".servico-card motion, .servico-card > div");
  return card ? window.getComputedStyle(card).transform : "not found";
});
console.log("Card hover transform:", cardTransform);
await page.screenshot({ path: "verify-card-3d.png" });

console.log("JS Errors:", errors.length ? errors.join(" | ") : "NONE");
await browser.close();
