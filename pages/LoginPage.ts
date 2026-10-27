import type { Locator, Page } from '@playwright/test'

export class LoginPage {

    // Define strict types for the playwright page instance and Locators

    private readonly page: Page;
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly showPassword: Locator;
    private readonly rememberMeCheckBox: Locator;

    // Initialize locators using Playwright's user-facing Locators

    constructor(page: Page) {
        this.page = page;

        this.emailInput = page.getByRole('textbox', { name: 'Text field for email input' });
        this.passwordInput = page.getByRole('textbox', { name: 'Text field for password input' });
        this.loginButton = page.getByRole('button', { name: 'Log in', exact: true });
        this.showPassword = page.getByRole('button', { name: 'Show Password' });
        this.rememberMeCheckBox = page.getByRole('checkbox', { name: 'Checkbox to stay logged in' });
    }

    // Navigate directly to the Login page route
    async goto(): Promise<void> {
        await this.page.goto('http://localhost:3000/#/login');
    }

    // Structural action sequence required to login
    async login(email: string, password: string): Promise<void> {
        await this.emailInput.fill(email)
        await this.passwordInput.fill(password)
        await this.showPassword.click()
        await this.rememberMeCheckBox.click()
        await this.loginButton.click()
    }

}
