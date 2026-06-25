import { test, expect } from "@playwright/test";

const baseUrl = process.env.SITE_URL || "http://127.0.0.1:4175";

test("homepage follows the reference layout", async ({ page }) => {
  await page.goto(baseUrl);
  await expect(page.getByText("Account Login")).toBeVisible();
  await expect(page.getByRole("link", { name: "Get Invited" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "商務連結平台 - 世界領先的人脈交際和商務引薦平台" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Links" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Newsletter" })).toBeVisible();
});

test("visit overlay and chapter search work", async ({ page }) => {
  await page.goto(baseUrl);
  await page.getByRole("link", { name: "Get Invited" }).first().click();
  await expect(page.getByRole("heading", { name: "Getting Started Easy" })).toBeVisible();
  await page.getByPlaceholder("查找分會").fill("台北");
  await page.getByRole("button", { name: "查找" }).click();
  await expect(page.locator("#chapter-message")).toContainText("台北");
});

test("mobile navigation opens", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseUrl);
  await page.getByRole("button", { name: "開啟選單" }).click();
  const mobileNav = page.getByRole("navigation", { name: "手機導覽" });
  await expect(mobileNav).toBeVisible();
  await mobileNav.getByRole("link", { name: /查找分會/ }).click();
  await expect(page.locator("#chapter")).toBeInViewport();
});

test("layout has no horizontal overflow", async ({ page }) => {
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto(baseUrl);
    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(hasOverflow).toBe(false);
  }
});
