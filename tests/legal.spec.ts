import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = [
  {path: "/viewer-terms", title: "Viewer Interaction Terms", sections: 9, last: "8. Responsibility, complaints and changes"},
  {
    path: "/privacy-policy",
    title: "Privacy Policy",
    sections: 10,
    last: "9. Policy updates",
  },
  {
    path: "/terms-and-conditions",
    title: "Creator Terms",
    sections: 11,
    last: "10. Contact, disputes and changes",
  },
  {
    path: "/cancellation-refunds",
    title: "Refund & Cancellation Policy",
    sections: 8,
    last: "7. Creator adjustments and complaints",
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
    await expect(article).toContainText("7 November 2026");
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

test("revised policies remove conflicting clauses and disclose pending retention controls", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("contentinfo").getByRole("link", { name: "Creator Terms", exact: true }).click();
  const article = page.getByRole("article");
  await expect(article).toContainText("Streamheart settles creator funds");
  await expect(article).not.toContainText("₹25,000");
  await expect(article).not.toContainText("13.2 Switching");
  const archive = page.getByRole("link", { name: "Read the previous policy (text)" });
  const response = await page.request.get((await archive.getAttribute("href"))!);
  expect(response.ok()).toBe(true);
  expect(await response.text()).toContain("13.2 Switching");
  await page.getByRole("navigation", { name: "Policy pages" }).getByRole("link", { name: "Privacy Policy", exact: true }).click();
  await expect(article).toContainText("they are not yet deployed");
  await expect(article).toContainText("at least one year");
  await expect(article).toContainText("72 hours");
  await expect(article).not.toContainText("Rule 8");
  await expect(article).not.toContainText("DPDP");
  await expect(article).toContainText("does not store KYC identity documents");
});

test('viewer and creator terms have distinct audiences and remain easy to find', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const footer = page.getByRole('contentinfo');
  await footer.getByRole('link', { name: 'Viewer Terms', exact: true }).click();
  await expect(page).toHaveURL(/\/viewer-terms$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Viewer Interaction Terms');
  const article = page.getByRole('article');
  await expect(article).toContainText('authority to use the payment method');
  await expect(article).toContainText('does not automatically make every charge non-refundable');
  await expect(article).toContainText('Viewers are not required to complete creator KYC');
  await page.getByRole('navigation', { name: 'Policy pages' }).getByRole('link', { name: 'Creator Terms', exact: true }).click();
  await expect(page).toHaveURL(/\/terms-and-conditions$/);
  await expect(article).toContainText('Creator verification is performed through Didit');
  await expect(article).toContainText('settlement schedule');
});
