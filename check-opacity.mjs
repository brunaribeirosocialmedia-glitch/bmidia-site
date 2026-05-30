import { chromium } from "@playwright/test";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on("pageerror", e => errors.push(e.message));
page.on("console", m => { if (m.type() === "error") errors.push("console: " + m.text()); });

await page.goto("https://brunaribeirosocialmedia-glitch.github.io/bmidia-site/", { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(4000);

const opacities = await page.evaluate(() => {
  // Checa opacidade dos gsap-reveal
  const reveals = document.querySelectorAll(".gsap-reveal");
  const revealOps = Array.from(reveals).slice(0, 5).map(el => ({
    opacity: window.getComputedStyle(el).opacity,
    inlineOpacity: el.style.opacity,
    transform: el.style.transform?.substring(0, 30) || "none",
  }));

  // Checa hero elements (Framer Motion)
  const heroContent = document.querySelector("section .absolute.inset-0.flex");
  const h1 = document.querySelector("h1");
  const subline = document.querySelector("section .absolute.bottom-20 p");

  return {
    revealSample: revealOps,
    heroLayerOpacity: heroContent ? window.getComputedStyle(heroContent).opacity : null,
    h1Opacity: h1 ? window.getComputedStyle(h1).opacity : null,
    sublineOpacity: subline ? window.getComputedStyle(subline).opacity : null,
    // Verifica se há elemento com opacity 0 bloqueando
    hiddenCount: Array.from(document.querySelectorAll("*"))
      .filter(el => parseFloat(window.getComputedStyle(el).opacity) === 0).length,
  };
});

console.log("Opacity check:", JSON.stringify(opacities, null, 2));
console.log("JS Errors:", errors.length ? errors : "NONE");

await browser.close();
