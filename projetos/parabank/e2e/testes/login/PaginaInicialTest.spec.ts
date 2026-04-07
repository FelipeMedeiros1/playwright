import test, { expect } from "@playwright/test";

test.describe("Página Inicial", () => {
    test("Deve acessar a página inicial", async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle("ParaBank | Welcome | Online Banking");
        await expect(page.getByRole("heading", { name: "Customer Login" })).toBeVisible();
    });
});

