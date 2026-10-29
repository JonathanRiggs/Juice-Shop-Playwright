import { faker } from '@faker-js/faker'
import { test, expect } from '../../src/fixtures'

test.describe('Login', () => {
    test.beforeEach(async ({ loginPage }) => {
        await loginPage.goto()
    })

    test('logs in with valid credentials', async ({ page, loginPage, user }) => {
        await loginPage.login(user.email, user.password)

        await expect(page).toHaveURL(/#\/search/)
        await page.getByRole('button', { name: 'Show/hide account menu' }).click()
        await expect(page.getByRole('menuitem', { name: 'Go to user profile' })).toContainText(user.email)
    })

    test('shows an error for a wrong password', async ({ page, loginPage, user }) => {
        await loginPage.login(user.email, 'WrongPassw0rd!')

        await expect(page.getByText('Invalid email or password.')).toBeVisible()
        await expect(page).toHaveURL(/#\/login/)
    })

    test('shows an error for an unregistered email', async ({ page, loginPage }) => {
        await loginPage.login(faker.internet.email(), 'Passw0rd!')

        expect(page.getByText('Invalid email or password.').isVisible())
        await expect(page).toHaveURL(/#\/login/)
    })

    test('disables the login button until both fields are filled', async ({ loginPage }) => {
        await expect(loginPage.loginButton).toBeDisabled()
    })
})
