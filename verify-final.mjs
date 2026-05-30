import { chromium } from "@playwright/test";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

page.on("pageerror", e => console.log("PAGE ERROR:", e.message));
page.on("console", m => { if (m.type() === "error") console.log("CONSOLE ERR:", m.text()); });

await page.goto("http://localhost:3000", { waitUntil: "load" });
await page.waitForTimeout(4000);

// Verify hero text + animations are resolved
const heroCheck = await page.evaluate(() => {
  const h1 = document.querySelector("h1");
  const logo = document.querySelector("section img");
  return {
    h1Text: h1?.textContent?.length ?? 0,
    h1Opacity: h1 ? window.getComputedStyle(h1).opacity : null,
    logoBounds: logo ? (() => {
      const r = logo.getBoundingClientRect();
      return { top: Math.round(r.top), visible: r.height > 0 };
    })() : null,
    wordRevealClipped: (() => {
      const spans = document.querySelectorAll("h1 span span");
      return Array.from(spans).filter(s => 
        window.getComputedStyle(s).clipPath === "none" ||
        window.getComputedStyle(s).clipPath?.includes("inset(0")
      ).length;
    })(),
    cursorElements: document.querySelectorAll(".fixed.rounded-full").length,
    heroLayers: document.querySelector("section")?.querySelectorAll(".absolute").length ?? 0,
  };
});
console.log("Hero check:", JSON.stringify(heroCheck, null, 2));

// Scroll via mouse wheel (works with Lenis)
await page.mouse.move(720, 450);
for (let i = 0; i < 20; i++) {
  await page.mouse.wheel(0, 220);
  await page.waitForTimeout(60);
}
await page.waitForTimeout(2500);

const scrollCheck = await page.evaluate(() => ({
  scrollY: window.scrollY,
  gsapRevealTotal: document.querySelectorAll(".gsap-reveal").length,
  gsapRevealVisible: Array.from(document.querySelectorAll(".gsap-reveal"))
    .filter(el => parseFloat(window.getComputedStyle(el).opacity) > 0.5).length,
  servicoCards: document.querySelectorAll(".servico-card").length,
  bodyOverflow: window.getComputedStyle(document.body).overflow,
}));
console.log("Scroll check:", JSON.stringify(scrollCheck, null, 2));

// Hover test for 3D card effect
await page.evaluate(() => window.scrollTo({ top: 2400, behavior: "instant" }));
await page.waitForTimeout(800);
const cardBounds = await page.evaluate(() => {
  const cards = document.querySelectorAll(".servico-card");
  return Array.from(cards).slice(0, 1).map(c => {
    const r = c.getBoundingClientRect();
    return { inView: r.top < 900 && r.bottom > 0, top: Math.round(r.top) };
  });
});
console.log("Service cards in view:", JSON.stringify(cardBounds));

if (cardBounds[0]?.inView) {
  const cardEl = await page.$(".servico-card > div");
  const cardRect = await cardEl?.boundingBox();
  if (cardRect) {
    await page.mouse.move(cardRect.x + cardRect.width * 0.75, cardRect.y + cardRect.height * 0.25);
    await page.waitForTimeout(400);
    const transform3d = await page.evaluate(() => {
      const inner = document.querySelector(".servico-card > div");
      return inner ? window.getComputedStyle(inner).transform : null;
    });
    console.log("3D card transform on hover:", transform3d?.substring(0, 60));
  }
}

await browser.close();
