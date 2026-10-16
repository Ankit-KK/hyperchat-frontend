import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("sculpture responds to every accessible scene control", async ({
  page,
}) => {
  await page.goto("/");
  const sculpture = page.locator(".sculpture").last();
  await expect(sculpture).toHaveAttribute("data-scene-ready", "true");
  for (const mode of ["Voice", "Presence", "Connection"]) {
    const control = page.getByRole("button", { name: mode, exact: true });
    await control.click();
    await expect(control).toHaveAttribute("aria-pressed", "true");
    await expect(sculpture).toHaveAttribute("data-mode", mode.toLowerCase());
  }
});

test("page has no serious or critical accessibility violations", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".sculpture")).toHaveAttribute(
    "data-scene-ready",
    "true",
  );
  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact ?? ""),
    ),
  ).toEqual([]);
});
