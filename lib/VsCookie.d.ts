import { GetCookieOptions, VsCookieOption } from "./types/VsCookie.types";
declare class VsCookie {
    /**
     *
     * @param value - value to hash
     * @param secret - hashing secret
     * @return {string | never} - returns hashed value
     *
     * @throws {TypeError | Error}
     */
    private static hash;
    /**
     * This function can be used to retrieve cookie from cookie string, and if cookie is signed please provide secret to get actual value.
     * Note:
     * 1. If cookie is signed and secret is not provided, whole cookie value will be returned along with signature
     * 2. If cookie is signed and secret is provided, cookie signature will be verified and the only original cookie value will be returned.
     * 3. If cookie is signed and secret is provided but cookie signature is invalid. This function will throw "Invalid cookie signature" error.
     * @param cookies - cookies string
     * @param cookieName - cookie name
     * @returns {string | never} - returns cookie
     *
     * @throws {TypeError | Error}
     */
    static getCookie(cookies?: string, cookieName?: string, options?: GetCookieOptions): string | never;
    /**
     * This function will help create cookie string based on options.
     * Please note even if createCookie function does not throw error in some scenario browser can reject cookies based on browser support and rules
     * @param cookieOption
     * @return {string | never} - returns cookie
     *
     * @throws {TypeError | Error}
     */
    static createCookie(cookieOption: VsCookieOption): string | never;
    /**
     * This function will sign cookie with cookie hash generated with provided secret
     * @param cookie {String} -- cookie value to sign
     * @param secret {String} -- secret to sign cookie with
     * @param encode {Function} -- function to encode cookie with default encodeURIComponent
     *
     * @throws {TypeError | Error}
     *
     * Eg: sign("test","This is cookie signing secret");
     * Returns: test:"hWtzMM7E4KTirRm3N8GZ4DB5E1b9j4DVtMYh4zkwvQ
     *
     */
    static sign(cookie: string, secret: string, encode?: Function): string | never;
    /**
     *
     * This function will validate cookie signature and returns true or false.
     *
     * Note: if cookie is not signed with sign function from this package or does not have same structure of
     * verification will fail and result will be false even if sign could be valid with other signing package
     * @param cookie {String} -- cookie value to sign
     * @param secret {String} -- cookie signed secret
     * @param decode {Function} -- function to decode cookie with default decodeURIComponent
     *
     * @return {boolean} - true if cookie has valid signature otherwise false
     *
     * @throws {TypeError | Error}
     */
    static verify(cookie: string, secret: string, decode?: Function): boolean | never;
    /**
     * This function will parse cookie from cookies string and return a object
     * @param cookies - cookies string
     * @param decode - decode function
     * @return {object} - parsed cookies {cookieName : cookieValue}
     *
     * @throws {TypeError | Error}
     *
     * eg: parse("test=test; test1=tetestetrs");
     * returns: { test: 'test', test1: 'tetestetrs' }
     *
     *
     */
    static parse(cookies: string, decode?: Function): object | never;
}
export default VsCookie;
