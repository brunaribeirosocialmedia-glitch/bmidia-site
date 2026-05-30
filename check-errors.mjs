import { chromium } from "@playwright/test";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
const warnings = [];
page.on("console", m => {
  if (m.type() === "error") errors.push(m.text());
  if (m.type() === "warning") warnings.push(m.text());
});
page.on("pageerror", e => errors.push("PAGE ERROR: " + e.message));

await page.goto("https://brunaribeirosocialmedia-glitch.github.io/bmidia-site/", { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(3000);

console.log("=== ERRORS ===");
errors.forEach(e => console.log(e));

console.log("\n=== DOM STATE ===");
const state = await page.evaluate(() => ({
  bodyChildren: document.body.children.length,
  mainExists: !!document.querySelector("main"),
  navExists: !!document.querySelector("nav"),
  h1Exists: !!document.querySelector("h1"),
  h1Text: document.querySelector("h1")?.textContent?.substring(0, 30),
  scriptErrors: window.__NEXT_DATA__ ? "Next data ok" : "No Next data",
  gsapReveals: document.querySelectorAll(".gsap-reveal").length,
  allText: document.body.innerText?.substring(0, 200),
}));
console.log(JSON.stringify(state, null, 2));

await browser.close();
