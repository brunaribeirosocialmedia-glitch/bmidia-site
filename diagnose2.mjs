import { chromium } from "@playwright/test";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const allErrors = [];
const allConsoleLogs = [];
page.on("pageerror", e => allErrors.push("PAGEERROR: " + e.message));
page.on("console", m => {
  const txt = m.type() + ": " + m.text().substring(0, 200);
  allConsoleLogs.push(txt);
  if (m.type() === "error" || m.type() === "warning") allErrors.push(txt);
});

await page.goto("https://brunaribeirosocialmedia-glitch.github.io/bmidia-site/", { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(6000);

// Estado detalhado - antes de rolar
const before = await page.evaluate(() => {
  var nav = document.querySelector("nav");
  var logo = document.querySelector("section img");
  var h1 = document.querySelector("h1");
  var firstReveal = document.querySelector(".gsap-reveal");
  var heroLayer2 = document.querySelector("section .absolute.inset-0.flex");
  return {
    nav: nav ? { opacity: window.getComputedStyle(nav).opacity, visible: nav.getBoundingClientRect().height > 0 } : null,
    logo: logo ? { opacity: window.getComputedStyle(logo).opacity, inlineStyle: logo.style.cssText.substring(0, 80) } : null,
    h1: h1 ? { opacity: window.getComputedStyle(h1).opacity, inlineStyle: h1.style.cssText.substring(0, 80) } : null,
    heroLayer2: heroLayer2 ? { opacity: window.getComputedStyle(heroLayer2).opacity, transform: window.getComputedStyle(heroLayer2).transform.substring(0, 50) } : null,
    firstReveal: firstReveal ? { opacity: window.getComputedStyle(firstReveal).opacity, inlineStyle: firstReveal.style.cssText.substring(0, 80) } : null,
    framerMotionRunning: !!document.querySelector("[data-framer-motion]") || document.querySelectorAll("[style*='transform']").length,
  };
});

console.log("Before scroll state:", JSON.stringify(before, null, 2));
console.log("\nErrors:", allErrors.length ? allErrors : "NONE");
console.log("\nAll console (first 15):", allConsoleLogs.slice(0, 15));

await browser.close();
