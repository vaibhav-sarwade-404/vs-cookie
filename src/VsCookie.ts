import { createHmac, timingSafeEqual } from "crypto";

import { GetCookieOptions, VsCookieOption } from "./types/VsCookie.types";

const isValidValue = (val: string | undefined = "") => !/\s|\t/g.test(val);
const separator = ":";
class VsCookie {
  /**
   *
   * @param value - value to hash
   * @param secret - hashing secret
   * @return {string | never} - returns hashed value
   *
   * @throws {TypeError | Error}
   */
  private static hash(value: string, secret: string): string | never {
    return createHmac("sha256", secret)
      .update(value)
      .digest("base64")
      .replace(/[=+/]/g, "");
  }

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
  static getCookie(
    cookies: string = "",
    cookieName: string = "",
    options?: GetCookieOptions
  ): string | never {
    const { decode = decodeURIComponent, secret } = options || {};
    if (!cookies || typeof cookies !== "string") {
      throw new TypeError(`parameter cookies should be string`);
    }
    if (!cookieName || typeof cookieName !== "string") {
      throw new TypeError(`parameter cookieName should be string`);
    }
    if (typeof decode !== "function") {
      throw new TypeError(`parameter decode should be function`);
    }
    if (secret && typeof secret !== "string") {
      throw new TypeError(`parameter secret should be string`);
    }
    const cookieNameValuePair = cookies.match(
      new RegExp(`${cookieName}=([^;]+)`)
    );
    const cookie = Array.isArray(cookieNameValuePair)
      ? cookieNameValuePair[1]
      : "";

    if (secret) {
      if (VsCookie.verify(cookie, secret))
        return decode(cookie.split(separator)[0] || "");
      throw new Error(`Invalid cookie signature`);
    }
    return decode(cookie);
  }

  /**
   * This function will help create cookie string based on options.
   * Please note even if createCookie function does not throw error in some scenario browser can reject cookies based on browser support and rules
   * @param cookieOption
   * @return {string | never} - returns cookie
   *
   * @throws {TypeError | Error}
   */
  static createCookie(cookieOption: VsCookieOption): string | never {
    if (Object.prototype.toString.call(cookieOption) !== "[object Object]") {
      throw new Error(`cookieOption should be an object.`);
    }
    const {
      name,
      value,
      Domain = "",
      encode = encodeURIComponent,
      HttpOnly = false,
      ["Max-Age"]: maxAge,
      Path,
      Prefix,
      Priority = "Medium",
      SameSite,
      Secure
    } = cookieOption;

    if (!name || !isValidValue(name)) {
      throw new TypeError(
        `Cookie name cannot be empty, undefined or contain spaces`
      );
    }
    if (!/^[^()<>@,;:"\/\[\]?={}]+$/.test(name)) {
      throw new TypeError(
        `Cookie name is invalid, cannot contain special characters ( ) < > @ , ; : " /[ ]?={}`
      );
    }

    if (!isValidValue(cookieOption.value)) {
      throw new TypeError(`Cookie Value cannot contain spaces`);
    }
    if (!isValidValue(Path)) {
      throw new TypeError(`Cookie Value cannot contain spaces`);
    }
    if (!isValidValue(Domain)) {
      throw new TypeError(`Cookie domain cannot contain spaces`);
    }

    if (Prefix) {
      if (Prefix === "__Host-") {
        if (Path !== "/")
          throw new TypeError(
            `Cookie with Prefix as "__Host-" cannot have path other than "/"`
          );
        if (Domain)
          throw new TypeError(
            `Cookie with Prefix as "__Host-" cannot have domain`
          );
      }
      if (Prefix === "__Secure-" && Secure === false) {
        throw new TypeError(
          `Cookie with Prefix as "__Secure-" can only be used with Secure attribute as "true"`
        );
      }
    }
    if (typeof encode !== "function") {
      throw new TypeError(`encode is not is not a function`);
    }

    const cookie = [`${Prefix ? Prefix + name : name}=${encode(value)}`];

    Domain && cookie.push(`Domain=${Domain}`);
    HttpOnly && cookie.push(`HttpOnly`);
    maxAge && cookie.push(`Max-Age=${maxAge}`);
    Priority && cookie.push(`Priority=${Priority}`);
    Secure && cookie.push("Secure");
    SameSite &&
      cookie.push(`SameSite=${SameSite === true ? "Strict" : SameSite}`);

    return cookie.join(";");
  }

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
  static sign(
    cookie: string,
    secret: string,
    encode: Function = encodeURIComponent
  ): string | never {
    if (typeof cookie !== "string" || !cookie) {
      throw new TypeError(`cookie should be a valid string`);
    }
    if (typeof secret !== "string" || !secret) {
      throw new TypeError(`secret should be a valid string`);
    }
    if (typeof encode !== "function") {
      throw new TypeError(`encode should be a function`);
    }
    return encode(`${cookie}${separator}${VsCookie.hash(cookie, secret)}`);
  }

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
  static verify(
    cookie: string,
    secret: string,
    decode: Function = decodeURIComponent
  ): boolean | never {
    if (typeof cookie !== "string" || !cookie) {
      throw new TypeError(`cookie should be a valid string`);
    }
    if (typeof secret !== "string" || !secret) {
      throw new TypeError(`secret should be a valid string`);
    }
    cookie = decode(cookie);
    const [originalCookieVal, originalCookieHash] = cookie.split(separator);

    if (!originalCookieVal || !originalCookieHash) {
      return false;
    }
    const cookieHash = VsCookie.hash(originalCookieVal, secret);
    const cookieBuffer1 = Buffer.from(originalCookieHash, "utf-8");
    const cookieBuffer2 = Buffer.from(cookieHash, "utf-8");
    return (
      cookieBuffer1.length === cookieBuffer2.length &&
      timingSafeEqual(
        Buffer.from(originalCookieHash, "utf-8"),
        Buffer.from(cookieHash, "utf-8")
      )
    );
  }

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
  static parse(
    cookies: string,
    decode: Function = decodeURIComponent
  ): object | never {
    if (typeof cookies !== "string") {
      throw new TypeError(`cookies should be a valid string`);
    }
    if (typeof decode !== "function") {
      throw new TypeError(`decode should be a function`);
    }
    let parsedCookies: { [key: string]: string } = {};
    if (!cookies) {
      return parsedCookies;
    }
    const cookiesArray = cookies.split(";");
    for (const cookieKeyValuePair of cookiesArray) {
      if (!cookieKeyValuePair) continue;
      const [cookieName, cookieValue = ""] = cookieKeyValuePair.split("=");
      parsedCookies[cookieName.trim()] = decode(cookieValue.trim());
    }
    return parsedCookies;
  }
}

export default VsCookie;
