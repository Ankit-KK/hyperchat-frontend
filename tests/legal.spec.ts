import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = [
  {
    path: "/privacy-policy",
    title: "Privacy Policy",
    sections: 11,
    last: "10. Contact Us",
  },
  {
    path: "/terms-and-conditions",
    title: "Terms and Conditions",
    sections: 14,
    last: "Section 13 — Platform Usage and Payouts",
  },
  {
    path: "/cancellation-refunds",
    title: "Refund & Cancellation Policy",
    sections: 11,
    last: "10. Final Decision Authority",
  },
];
for (const policy of pages) {
  test(`local policy loads and remains readable: ${policy.path}`, async ({
    page,
  }, info) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(policy.path);
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      policy.title,
    );
    await expect(page).toHaveTitle(`HyperChat — ${policy.title}`);
    const article = page.getByRole("article", { name: policy.title });
    await expect(article.locator(":scope > section")).toHaveCount(
      policy.sections,
    );
    await expect(article).toContainText("STREAMHEART PRIVATE LIMITED");
    await expect(article).toContainText("07-05-2025");
    await expect(article).not.toContainText("ankit@hyperchat.site");
    await expect(article).not.toContainText("ankit.hyperchat@gmail.com");
    await expect(
      article.locator('a[href="mailto:ankit@hyperchat.space"]').first(),
    ).toBeVisible();
    await page
      .getByRole("navigation", { name: "On this page" })
      .getByRole("link", { name: policy.last, exact: true })
      .click();
    await expect(
      article.getByRole("heading", { name: policy.last, exact: true }),
    ).toBeInViewport();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const audit = await new AxeBuilder({ page }).analyze();
    expect(
      audit.violations.filter((v) =>
        ["serious", "critical"].includes(v.impact ?? ""),
      ),
    ).toEqual([]);
    await page.screenshot({
      path: `test-results/legal-${policy.path.slice(1)}-${info.project.name}.png`,
    });
    const footer = page.getByRole("contentinfo");
    for (const destination of pages)
      await expect(footer.locator(`a[href="${destination.path}"]`)).toHaveCount(
        1,
      );
  });
}

test("footer opens local legal pages and terms retain all published amendments", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("main > section")).toHaveCount(7);
  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: "Terms", exact: true })
    .click();
  await expect(page).toHaveURL(/\/terms-and-conditions$/);
  const article = page.getByRole("article");
  await expect(article).toContainText(
    "Effective Date: 25-03-2026 | Version 1.0",
  );
  await expect(
    article.getByRole("heading", {
      name: "12.7.1 Liquidated Damages for Continuing Violations",
      exact: true,
    }),
  ).toHaveCount(1);
  await expect(
    article.getByRole("heading", {
      name: "13.7 HyperChat's Discretion",
      exact: true,
    }),
  ).toHaveCount(1);
  await page
    .getByRole("navigation", { name: "Policy pages" })
    .getByRole("link", { name: "Privacy Policy", exact: true })
    .click();
  await expect(page).toHaveURL(/\/privacy-policy$/);
});
