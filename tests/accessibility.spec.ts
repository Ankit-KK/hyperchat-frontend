import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("hero and interactive creator panels have no serious accessibility violations", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const tab of [null, "04 Creator reporting", "05 Community moderation"]) {
    if (tab) await page.getByRole("tab", { name: tab }).click();
    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations.filter((violation) =>
        ["serious", "critical"].includes(violation.impact ?? ""),
      ),
    ).toEqual([]);
  }
});
