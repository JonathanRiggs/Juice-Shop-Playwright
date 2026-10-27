import { type APIRequestContext, expect } from '@playwright/test'

export class JuiceShopApi {
    constructor(private request: APIRequestContext) { }

    async register(email: string, password: string) {
        const res = await this.request.post('/api/Users', {
            data: {
                email, password, passwordRepeat: password,
                securityQuestion: { id: 1 }, securityAnswer: 'test',
            },
        });
        expect(res.ok()).toBeTruthy()
    }

    async login(email: string, password: string) {
        const res = await this.request.post('/rest/user/login', { data: { email, password } })
        expect(res.ok()).toBeTruthy();
        const { authentication } = await res.json();
        return { token: authentication.token as string, bid: authentication.bid as number };
    }
}