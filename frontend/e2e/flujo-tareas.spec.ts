import { test, expect } from "@playwright/test";

test("un usuario puede registrarse, iniciar sesión, crear una tarea y verla en la lista", async ({
  page,
}) => {
  const email = `e2e-${Date.now()}@test.com`;
  const password = "Password123!";

  // 1. Registro
  await page.goto("/register");
  await page.getByPlaceholder("Name").fill("Usuario E2E");
  await page.getByPlaceholder("Email").fill(email);
  await page.getByPlaceholder("Password", { exact: true }).fill(password);
  await page.getByPlaceholder("Confirm password").fill(password);
  await page.getByRole("button", { name: "Sign Up" }).click();

  // 2. Login
  await page.waitForURL("**/login");
  await page.getByPlaceholder("Email").fill(email);
  await page.getByPlaceholder("Password").fill(password);
  await page.getByRole("button", { name: "Log In" }).click();

  // 3. Crear una tarea
  await page.waitForURL("http://localhost:5173/");
  await page.getByPlaceholder("What needs to be done?").fill("Comprar pan");
  await page.getByRole("button", { name: "Add Task" }).click();

  // 4. Verla en la lista
  await expect(page.getByText("Comprar pan")).toBeVisible();
});
