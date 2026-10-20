import { test as base, Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { JuiceShopApi } from '../api/JuiceShopApi';

type Fixtures = { api: JuiceShopApi; loggedInPage: Page };

export const test = base.extend<Fixtures>({
    page: async ({ page, context, baseURL }, use) => {
        await context.addCookies([
            { name: 'welcombanner_status', value: 'dismiss', url: baseURL! },
            { name: 'cookieconsent_status', value: 'dismiss', url: baseURL! },
        ]);
        await use(page);
    },

    api: async ({ request }, use) => use(new JuiceShopApi(request)),

    loggedInPage: async ({ page, context, api, baseURL }, use) => {
        const email = faker.internet.email();
        const password = 'Passw0rd!';
        await api.register(email, password);
        const { token, bid } = await api.login(email, password);

        await context.addCookies([{ name: 'token', value: token, url: baseURL! }]);
        await page.addInitScript(([t, b]) => {
            localStorage.setItem('token', t);
            sessionStorage.setItem('bid', b);
        }, [token, String(bid)]);

        await use(page);
    }
})