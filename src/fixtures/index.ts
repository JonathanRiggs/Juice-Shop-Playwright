import { faker } from '@faker-js/faker';
import { test as base, type Page } from '@playwright/test';
import { JuiceShopApi } from '../api/JuiceShopApi';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';

type User = { email: string; password: string };

type Fixtures = {
    api: JuiceShopApi;
    user: User;
    loggedInPage: Page;
    loginPage: LoginPage;
    registerPage: RegisterPage;
};

function requireBaseURL(baseURL: string | undefined): string {
    if (!baseURL) throw new Error('baseURL is not set in playwright.config.ts');
    return baseURL;
}

export const test = base.extend<Fixtures>({
    page: async ({ page, context, baseURL }, use) => {
        const url = requireBaseURL(baseURL)
        await context.addCookies([
            { name: 'welcomebanner_status', value: 'dismiss', url },
            { name: 'cookieconsent_status', value: 'dismiss', url },
        ]);
        await use(page);
    },

    api: async ({ request }, use) => use(new JuiceShopApi(request)),

    // A freshly registered user (via API) whose credentials tests can use
    user: async ({ api }, use) => {
        const email = faker.internet.email();
        const password = 'Passw0rd!';
        await api.register(email, password);
        await use({ email, password });
    },

    loggedInPage: async ({ page, context, api, user, baseURL }, use) => {
        const url = requireBaseURL(baseURL)
        const { token, bid } = await api.login(user.email, user.password);

        await context.addCookies([{ name: 'token', value: token, url }]);
        await page.addInitScript(([t, b]) => {
            localStorage.setItem('token', t);
            sessionStorage.setItem('bid', b);
        }, [token, String(bid)]);

        await use(page);
    },

    // Unauthenticated page object; request `user` alongside it for valid credentials
    loginPage: async ({ page }, use) => use(new LoginPage(page)),

    registerPage: async ({ page }, use) => use(new RegisterPage(page)),
})

export { expect } from '@playwright/test';
