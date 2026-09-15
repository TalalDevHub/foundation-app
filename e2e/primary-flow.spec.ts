import { test, expect } from "@playwright/test";

test.describe("Primary Flow E2E: Chat & Architectural Inspection", () => {
  test("completes end-to-end audit loop and handles retry interaction", async ({ page }) => {
    await page.goto("/chat");

    // 1. Verify empty state onboarding
    await expect(page.getByText(/no active conversation/i)).toBeVisible();

    // 2. Trigger primary audit action
    await page.getByRole("button", { name: /audit a11y primitives/i }).click();

    // 3. Verify generative UI tool card mounts with results
    await expect(page.getByText("a11y-primitives")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("/100").first()).toBeVisible();

    // 4. Test mid-stream error recovery card
    const input = page.getByPlaceholder(/ask question or type/i);
    await input.fill("Sabotage mid-stream");
    await page.getByRole("button", { name: /send/i }).click();

    // 5. Verify error recovery button renders
    const retryBtn = page.getByRole("button", { name: /retry failed query/i });
    await expect(retryBtn).toBeVisible({ timeout: 15000 });
  });
});
