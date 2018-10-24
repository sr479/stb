import { Cookie } from "../basic/cookie";

export class PageSource {
    private cookie: Cookie;
    private cookieName: string;
    constructor(cookieName: string) {
        this.cookieName = cookieName;
        this.cookie = new Cookie(this.cookieName);
    }
    saveToLocal(url?: string) {
        let cookie = this.cookie;
        if (url) {
            let referrer = cookie.getCookie();
            if (!referrer) {
                cookie.setCookie(url);
            }
        } else {
            let referrer = cookie.getCookie();
            if (!referrer) {
                if (document.referrer) {
                    cookie.setCookie(document.referrer);
                } else {
                    cookie.setCookie(null);
                }
            }
        }
    }
    takeToLocal() {
        return this.cookie.getCookie();
    }
    removeToLocal(): string {
        let url = this.cookie.getCookie();
        this.cookie.clearCookie();
        return url;
    }
}