import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL ?? "http://127.0.0.1:3000/";
const OUT_DIR = process.env.OUT_DIR ?? "screenshots/before";
const VIEWPORT_WIDTH = Number.parseInt(process.env.VIEWPORT_WIDTH ?? "1440", 10);
const VIEWPORT_HEIGHT = Number.parseInt(process.env.VIEWPORT_HEIGHT ?? "900", 10);

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function gotoAndSettle(page) {
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(250);
  await page.waitForSelector("nav");
  await page.waitForTimeout(250);
}

async function clickTab(page, tabName) {
  // Tabs live in the SectionBar (between workstation top and content).
  // Scope there to avoid collisions with similarly-named chips/buttons in content.
  await page.waitForSelector(".es-sectionbar");
  const tabButton = page
    .locator(".es-sectionbar")
    .getByRole("tab", { name: tabName, exact: true })
    .first();
  await tabButton.click();
  await page.waitForTimeout(250);
}

async function main() {
  const outDirAbs = path.resolve(process.cwd(), OUT_DIR);
  await ensureDir(outDirAbs);

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  await gotoAndSettle(page);
  const suffix = `${VIEWPORT_WIDTH}px`;
  await page.screenshot({ path: path.join(outDirAbs, `01-results-${suffix}.png`), fullPage: true });

  // Expanded advanced options state (Results tab)
  const advToggle = page.getByRole("button", { name: "Advanced options", exact: true });
  if (await advToggle.count()) {
    await advToggle.first().click();
    await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(outDirAbs, `01-results-advanced-${suffix}.png`), fullPage: true });
  }

  // Focus query textarea to verify focus ring is not clipped
  const query = page.getByRole("textbox", { name: "Query (optional)", exact: true });
  if (await query.count()) {
    await query.first().click();
    await page.waitForTimeout(150);
    await page.screenshot({ path: path.join(outDirAbs, `01-results-query-focus-${suffix}.png`), fullPage: true });
  }

  await clickTab(page, "Evidence");
  await page.screenshot({ path: path.join(outDirAbs, `02-evidence-${suffix}.png`), fullPage: true });

  await clickTab(page, "IR");
  await page.screenshot({ path: path.join(outDirAbs, `03-ir-${suffix}.png`), fullPage: true });

  await browser.close();
  // eslint-disable-next-line no-console
  console.log(`Saved screenshots to ${outDirAbs}`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
});


