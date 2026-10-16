import { test, expect } from "@playwright/test";
test("support preview follows all stages, resets and makes no transaction request", async ({
  page,
}, info) => {
  const external: string[] = [];
  page.on("request", (r) => {
    if (r.method() !== "GET") external.push(`${r.method()} ${r.url()}`);
  });
  await page.goto("/");
  await page.getByRole("button", { name: "₹500", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "₹500", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "Play interaction", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Following the interaction…" }),
  ).toBeDisabled();
  await expect(page.locator(".interaction-demo .stream-alert")).toHaveClass(
    /visible/,
  );
  await expect(page.locator(".interaction-demo .stream-alert")).toContainText(
    "Ari sent ₹500",
  );
  await expect(
    page.getByText("Example event received by creator"),
  ).toBeVisible();
  await expect(page.getByRole("status")).toContainText(
    "The audience sees the message",
  );
  await page.locator(".interaction-demo").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: `test-results/${info.project.name}-interaction.png`,
  });
  await page.getByRole("button", { name: "Reset demo" }).click();
  await expect(page.locator(".interaction-demo .stream-alert")).not.toHaveClass(
    /visible/,
  );
  await expect(
    page.getByRole("button", { name: "Play interaction", exact: true }),
  ).toBeEnabled();
  await page
    .getByRole("button", { name: "Play interaction", exact: true })
    .click();
  await page.getByRole("button", { name: "Reset demo" }).click();
  await page.waitForTimeout(2200);
  await expect(page.locator(".interaction-demo .stream-alert")).not.toHaveClass(
    /visible/,
  );
  expect(external).toEqual([]);
});
test("creator examples and stream interaction controls work", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("tab", { name: "03 Soundboard" }).click();
  await page.getByRole("button", { name: "Select example sound" }).click();
  await expect(
    page.getByRole("button", { name: "Selected: applause" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("tab", { name: "05 Community moderation" }).click();
  await page.getByRole("button", { name: "Hide example message" }).click();
  await expect(
    page.getByRole("button", { name: "Example message hidden" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Example message hidden" }).click();
  await expect(
    page.getByRole("button", { name: "Hide example message" }),
  ).toHaveAttribute("aria-pressed", "false");
  for (const [name, kind] of [
    ["Soundboard", "sound"],
    ["Voice message", "voice"],
    ["Support", "support"],
  ]) {
    await page
      .getByRole("group", { name: "Preview stream interactions" })
      .getByRole("button", { name, exact: true })
      .click();
    await expect(page.locator(".moment-visual .stream-stage")).toHaveAttribute(
      "data-event",
      kind,
    );
  }
});
