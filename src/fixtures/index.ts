import { faker } from '@faker-js/faker';
import { test as base, type Page } from '@playwright/test';
import { JuiceShopApi } from '../api/JuiceShopApi';

type Fixtures = { api: JuiceShopApi; loggedInPage: Page };

function requireBaseURL(baseURL: string | undefined): string {
    if (!baseURL) throw new Error('baseURL is not set in playwright.config.ts');
    return baseURL;
}

export const test = base.extend<Fixtures>({
    page: async ({ page, context, baseURL }, use) => {
        const url = requireBaseURL(baseURL)
        await context.addCookies([
            { name: 'welcombanner_status', value: 'dismiss', url },
            { name: 'cookieconsent_status', value: 'dismiss', url },
        ]);
        await use(page);
    },

    api: async ({ request }, use) => use(new JuiceShopApi(request)),

    loggedInPage: async ({ page, context, api, baseURL }, use) => {
        const url = requireBaseURL(baseURL)
        const email = faker.internet.email();
        const password = 'Passw0rd!';
        await api.register(email, password);
        const { token, bid } = await api.login(email, password);

        await context.addCookies([{ name: 'token', value: token, url }]);
        await page.addInitScript(([t, b]) => {
            localStorage.setItem('token', t);
            sessionStorage.setItem('bid', b);
        }, [token, String(bid)]);

        await use(page);
    }
})