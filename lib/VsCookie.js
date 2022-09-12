"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = require("crypto");
var isValidValue = function (val) {
    if (val === void 0) { val = ""; }
    return !/\s|\t/g.test(val);
};
var separator = ":";
var VsCookie = /** @class */ (function () {
    function VsCookie() {
    }
    /**
     *
     * @param value - value to hash
     * @param secret - hashing secret
     * @return {string | never} - returns hashed value
     *
     * @throws {TypeError | Error}
     */
    VsCookie.hash = function (value, secret) {
        return (0, crypto_1.createHmac)("sha256", secret)
            .update(value)
            .digest("base64")
            .replace(/[=+/]/g, "");
    };
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
    VsCookie.getCookie = function (cookies, cookieName, options) {
        if (cookies === void 0) { cookies = ""; }
        if (cookieName === void 0) { cookieName = ""; }
        var _a = options || {}, _b = _a.decode, decode = _b === void 0 ? decodeURIComponent : _b, secret = _a.secret;
        if (!cookies || typeof cookies !== "string") {
            throw new TypeError("parameter cookies should be string");
        }
        if (!cookieName || typeof cookieName !== "string") {
            throw new TypeError("parameter cookieName should be string");
        }
        if (typeof decode !== "function") {
            throw new TypeError("parameter decode should be function");
        }
        if (secret && typeof secret !== "string") {
            throw new TypeError("parameter secret should be string");
        }
        var cookieNameValuePair = cookies.match(new RegExp("".concat(cookieName, "=([^;]+)")));
        var cookie = Array.isArray(cookieNameValuePair)
            ? cookieNameValuePair[1]
            : "";
        if (secret) {
            if (VsCookie.verify(cookie, secret))
                return decode(cookie).split(separator)[0] || "";
            throw new Error("Invalid cookie signature");
        }
        return decode(cookie);
    };
    /**
     * This function will help create cookie string based on options.
     * Please note even if createCookie function does not throw error in some scenario browser can reject cookies based on browser support and rules
     * @param cookieOption
     * @return {string | never} - returns cookie
     *
     * @throws {TypeError | Error}
     */
    VsCookie.createCookie = function (cookieOption) {
        if (Object.prototype.toString.call(cookieOption) !== "[object Object]") {
            throw new Error("cookieOption should be an object.");
        }
        var name = cookieOption.name, value = cookieOption.value, _a = cookieOption.Domain, Domain = _a === void 0 ? "" : _a, _b = cookieOption.encode, encode = _b === void 0 ? encodeURIComponent : _b, _c = cookieOption.HttpOnly, HttpOnly = _c === void 0 ? false : _c, maxAge = cookieOption["Max-Age"], Path = cookieOption.Path, Prefix = cookieOption.Prefix, _d = cookieOption.Priority, Priority = _d === void 0 ? "Medium" : _d, SameSite = cookieOption.SameSite, Secure = cookieOption.Secure;
        if (!name || !isValidValue(name)) {
            throw new TypeError("Cookie name cannot be empty, undefined or contain spaces");
        }
        if (!/^[^()<>@,;:"\/\[\]?={}]+$/.test(name)) {
            throw new TypeError("Cookie name is invalid, cannot contain special characters ( ) < > @ , ; : \" /[ ]?={}");
        }
        if (!isValidValue(cookieOption.value)) {
            throw new TypeError("Cookie Value cannot contain spaces");
        }
        if (!isValidValue(Path)) {
            throw new TypeError("Cookie Value cannot contain spaces");
        }
        if (!isValidValue(Domain)) {
            throw new TypeError("Cookie domain cannot contain spaces");
        }
        if (Prefix) {
            if (Prefix === "__Host-") {
                if (Path !== "/")
                    throw new TypeError("Cookie with Prefix as \"__Host-\" cannot have path other than \"/\"");
                if (Domain)
                    throw new TypeError("Cookie with Prefix as \"__Host-\" cannot have domain");
            }
            if (Prefix === "__Secure-" && Secure === false) {
                throw new TypeError("Cookie with Prefix as \"__Secure-\" can only be used with Secure attribute as \"true\"");
            }
        }
        if (SameSite && !Secure) {
            throw new TypeError("Cookie SameSite can only be used with Secure attribute as \"true\"");
        }
        if (typeof encode !== "function") {
            throw new TypeError("encode is not is not a function");
        }
        var cookie = ["".concat(Prefix ? Prefix + name : name, "=").concat(encode(value))];
        Domain && cookie.push("Domain=".concat(Domain));
        HttpOnly && cookie.push("HttpOnly");
        if (typeof maxAge === "number") {
            cookie.push("Max-Age=".concat(maxAge));
        }
        Priority && cookie.push("Priority=".concat(Priority));
        Secure && cookie.push("Secure");
        SameSite &&
            cookie.push("SameSite=".concat(SameSite === true ? "Strict" : SameSite));
        return cookie.join(";");
    };
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
    VsCookie.sign = function (cookie, secret, encode) {
        if (encode === void 0) { encode = encodeURIComponent; }
        if (typeof cookie !== "string" || !cookie) {
            throw new TypeError("cookie should be a valid string");
        }
        if (typeof secret !== "string" || !secret) {
            throw new TypeError("secret should be a valid string");
        }
        if (typeof encode !== "function") {
            throw new TypeError("encode should be a function");
        }
        return encode("".concat(cookie).concat(separator).concat(VsCookie.hash(cookie, secret)));
    };
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
    VsCookie.verify = function (cookie, secret, decode) {
        if (decode === void 0) { decode = decodeURIComponent; }
        if (typeof cookie !== "string" || !cookie) {
            throw new TypeError("cookie should be a valid string");
        }
        if (typeof secret !== "string" || !secret) {
            throw new TypeError("secret should be a valid string");
        }
        cookie = decode(cookie);
        var _a = __read(cookie.split(separator), 2), originalCookieVal = _a[0], originalCookieHash = _a[1];
        if (!originalCookieVal || !originalCookieHash) {
            return false;
        }
        var cookieHash = VsCookie.hash(originalCookieVal, secret);
        var cookieBuffer1 = Buffer.from(originalCookieHash, "utf-8");
        var cookieBuffer2 = Buffer.from(cookieHash, "utf-8");
        return (cookieBuffer1.length === cookieBuffer2.length &&
            (0, crypto_1.timingSafeEqual)(Buffer.from(originalCookieHash, "utf-8"), Buffer.from(cookieHash, "utf-8")));
    };
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
    VsCookie.parse = function (cookies, decode) {
        var e_1, _a;
        if (decode === void 0) { decode = decodeURIComponent; }
        if (typeof cookies !== "string") {
            throw new TypeError("cookies should be a valid string");
        }
        if (typeof decode !== "function") {
            throw new TypeError("decode should be a function");
        }
        var parsedCookies = {};
        if (!cookies) {
            return parsedCookies;
        }
        var cookiesArray = cookies.split(";");
        try {
            for (var cookiesArray_1 = __values(cookiesArray), cookiesArray_1_1 = cookiesArray_1.next(); !cookiesArray_1_1.done; cookiesArray_1_1 = cookiesArray_1.next()) {
                var cookieKeyValuePair = cookiesArray_1_1.value;
                if (!cookieKeyValuePair)
                    continue;
                var _b = __read(cookieKeyValuePair.split("="), 2), cookieName = _b[0], _c = _b[1], cookieValue = _c === void 0 ? "" : _c;
                parsedCookies[cookieName.trim()] = decode(cookieValue.trim());
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (cookiesArray_1_1 && !cookiesArray_1_1.done && (_a = cookiesArray_1.return)) _a.call(cookiesArray_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return parsedCookies;
    };
    return VsCookie;
}());
exports.default = VsCookie;
