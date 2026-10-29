import type { Locator, Page } from '@playwright/test'

export class RegisterPage {
    private readonly page: Page;
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly repeatPassInput: Locator;
    private readonly securityQuestion: Locator;
    private readonly answer: Locator;
    private readonly registerButton: Locator;

    constructor(page: Page) {
        this.page = page

        this.emailInput = page.getByRole('textbox', { name: 'Email address field' })
        this.passwordInput = page.getByRole('textbox', { name: 'Field for the password' })
        this.repeatPassInput = page.getByRole('textbox', { name: 'Field to confirm the password' })
        this.securityQuestion = page.getByRole('combobox', { name: 'Selection list for the security question' })
        this.answer = page.getByRole('textbox', { name: 'Field for the answer to the' })
        this.registerButton = page.getByRole('button', { name: 'Button to complete the' })
    }

    async goto(): Promise<void> {
        await this.page.goto('/#/register')
    }

    async register(email: string, password: string, answer: string): Promise<void> {

        await this.emailInput.fill(email)
        await this.passwordInput.fill(password)
        await this.repeatPassInput.fill(password)
        await this.securityQuestion.click()
        await this.page.getByRole('option', { name: 'Your favorite book?' }).click()
        await this.answer.fill(answer)
        await this.registerButton.click()
    }
}