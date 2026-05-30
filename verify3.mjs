import { chromium } from "@playwright/test";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

page.on("pageerror", e => console.log("ERROR:", e.message));

await page.goto("http://localhost:3000", { waitUntil: "load" });
await page.waitForTimeout(4000);

// Check bounding boxes - are elements on-screen?
const bounds = await page.evaluate(() => {
  const h1 = document.querySelector("h1");
  const logo = document.querySelector("img[alt='B Mídia']");
  const ctaBtn = document.querySelector("a[href='#cta']");
  const nav = document.querySelector("nav");

  const getInfo = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const s = window.getComputedStyle(el);
    return {
      top: Math.round(r.top), left: Math.round(r.left),
      width: Math.round(r.width), height: Math.round(r.height),
      opacity: s.opacity, visibility: s.visibility, display: s.display,
      color: s.color, fontSize: s.fontSize
    };
  };

  return {
    h1: getInfo(h1),
    logo: getInfo(logo),
    ctaBtn: getInfo(ctaBtn),
    nav: getInfo(nav),
  };
});

console.log("Bounding boxes:");
Object.entries(bounds).forEach(([k,v]) => console.log(` ${k}:`, JSON.stringify(v)));

// Check the hero layer structure
const layers = await page.evaluate(() => {
  const hero = document.querySelector("section");
  if (!hero) return [];
  return Array.from(hero.children).map(el => {
    const s = window.getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      tag: el.tagName,
      class: el.className.substring(0, 50),
      position: s.position,
      top: Math.round(r.top),
      opacity: s.opacity,
      zIndex: s.zIndex,
      transform: s.transform.substring(0, 60),
    };
  });
});
console.log("\nHero layer children:");
layers.forEach((l, i) => console.log(` Layer ${i}:`, JSON.stringify(l)));

// Specifically check hero image and overlay
const overlayCheck = await page.evaluate(() => {
  const heroImg = document.querySelector("section img");
  const overlay = document.querySelector("section .absolute.inset-0 > div.absolute");
  return {
    imgSrc: heroImg?.src?.substring(0, 60),
    imgOpacity: heroImg ? window.getComputedStyle(heroImg).opacity : null,
    overlayBg: overlay ? window.getComputedStyle(overlay).background.substring(0, 100) : "not found",
  };
});
console.log("\nOverlay check:", JSON.stringify(overlayCheck));

// Check that nav and its elements are visible
const navCheck = await page.evaluate(() => {
  const nav = document.querySelector("nav");
  if (!nav) return null;
  const s = window.getComputedStyle(nav);
  return {
    bg: s.backgroundColor,
    position: s.position,
    zIndex: s.zIndex,
    visible: nav.getBoundingClientRect().height > 0,
  };
});
console.log("Nav check:", JSON.stringify(navCheck));

await browser.close();
