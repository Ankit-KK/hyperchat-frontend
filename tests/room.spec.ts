import { test, expect } from "@playwright/test";

test("local room supports joining, messages, persistence, topics, and leaving", async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.goto("/");
  await expect(page.locator(".sculpture")).toHaveAttribute(
    "data-scene-ready",
    "true",
  );
  const room = page.locator("#live-room");
  await room.scrollIntoViewIfNeeded();
  await room.getByRole("button", { name: "Join room", exact: true }).click();
  const input = room.getByRole("textbox", { name: "Your message" });
  await room.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(room.getByRole("alert")).toContainText(
    "Write a little something",
  );
  await input.fill("x".repeat(281));
  await room.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(room.getByRole("alert")).toContainText(
    "Keep it to 280 characters",
  );
  await input.fill("A thoughtful place to share an idea.");
  await room.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(
    room.getByText("A thoughtful place to share an idea.", { exact: true }),
  ).toBeVisible();
  await expect(input).toHaveValue("");
  await expect
    .poll(() =>
      page.evaluate(
        () => localStorage.getItem("hyperchat.local-rooms.v1") ?? "",
      ),
    )
    .toContain("A thoughtful place to share an idea.");
  await expect(room.getByRole("status")).toContainText("Demo reply received");
  await page.reload();
  await expect(page.locator(".sculpture")).toHaveAttribute(
    "data-scene-ready",
    "true",
  );
  await room.scrollIntoViewIfNeeded();
  await expect(
    room.getByText("A thoughtful place to share an idea.", { exact: true }),
  ).toBeVisible();
  await room.getByRole("button", { name: "Open studio", exact: false }).click();
  await expect(
    room.getByText("A thoughtful place to share an idea.", { exact: true }),
  ).toHaveCount(0);
  await room.getByRole("button", { name: "Join room", exact: true }).click();
  await room
    .getByRole("button", { name: "Say hello to the demo room", exact: true })
    .click();
  await room.getByRole("button", { name: "Leave room", exact: true }).click();
  await expect(
    room.getByRole("button", { name: "Join room", exact: true }),
  ).toBeVisible();
  await room
    .getByRole("button", { name: "Reset chat to the welcome message" })
    .click();
  await expect(
    room.getByText("A little hello from me. Glad to be here.", { exact: true }),
  ).toHaveCount(0);
  await room.getByRole("button", { name: "After hours", exact: false }).click();
  await expect(
    room.getByText("A thoughtful place to share an idea.", { exact: true }),
  ).toBeVisible();
});
