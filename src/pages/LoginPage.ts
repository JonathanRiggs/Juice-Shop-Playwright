import type { Locator, Page } from '@playwright/test'

export class LoginPage {

    // Define strict types for the playwright page instance and Locators

    private readonly page: Page;
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    readonly loginButton: Locator;

    // Initialize locators using Playwright's user-facing Locators

    constructor(page: Page) {
        this.page = page;

        this.emailInput = page.getByRole('textbox', { name: 'Text field for the login email' });
        this.passwordInput = page.getByRole('textbox', { name: 'Text field for the login password' });
        this.loginButton = page.getByRole('button', { name: 'Login', exact: true });
    }

    // Navigate directly to the Login page route
    async goto(): Promise<void> {
        await this.page.goto('/#/login');
    }

    // Structural action sequence required to login
    async login(email: string, password: string): Promise<void> {
        await this.emailInput.fill(email)
        await this.passwordInput.fill(password)
        await this.loginButton.click()
    }

}
