import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("hero and interactive creator panels have no serious accessibility violations", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const tab of [
    null,
    "04 Interaction history",
    "05 Community moderation",
    "01 Viewer interactions",
  ]) {
    if (tab) await page.getByRole("tab", { name: tab }).click();
    if (tab === "01 Viewer interactions")
      await page.getByRole("button", { name: "Voice", exact: true }).click();
    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations.filter((violation) =>
        ["serious", "critical"].includes(violation.impact ?? ""),
      ),
    ).toEqual([]);
  }
});
