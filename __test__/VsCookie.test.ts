import { createCookie, getCookie, parse, sign, verify } from "../src";

describe("Vs Cookie", () => {
  const cookieValue = "Test cookie value";
  const secret = "This is test cookie signing secret";
  const signedCookie = sign(cookieValue, secret);
  const separator = "-";
  const cookieSignatureSeparator = "$@$";
  const signedCookieWithDifferentSeparator = sign(cookieValue, secret, {
    separator
  });
  test("generate cookie", () => {
    const cookie = createCookie({ name: "test", value: "test" });
    expect(cookie).toEqual("test=test;Priority=Medium");
  });

  describe("get cookie", () => {
    test("with signature if present", () => {
      const cookie = getCookie(
        `test=test;test1=test1;encodedSignedCookie=${signedCookie}`,
        "encodedSignedCookie"
      );
      expect(cookie).toEqual(decodeURIComponent(signedCookie));
    });

    test("with signature if present, signed with seperator as `-`", () => {
      const cookie = getCookie(
        `test=test;test1=test1;encodedSignedCookie=${signedCookieWithDifferentSeparator}`,
        "encodedSignedCookie",
        { separator, secret }
      );
      expect(cookie).toEqual(cookieValue);
    });

    test("without signature, verified if present", () => {
      const cookie = getCookie(
        `test=test;test1=test1;encodedSignedCookie=${signedCookie}`,
        "encodedSignedCookie",
        {
          secret
        }
      );
      expect(cookie).toEqual(cookieValue);
    });
  });

  test("parse cookies", () => {
    const parsedCookies = parse("test=test;test1=test1;");
    expect(JSON.stringify(parsedCookies)).toEqual(
      JSON.stringify({
        test: "test",
        test1: "test1"
      })
    );
  });

  describe("Sign cookie", () => {
    test("valid cookie value", () => {
      const _signedCookie = sign(cookieValue, secret);
      const isValidCookie = verify(_signedCookie, secret);
      expect(isValidCookie).toBeTruthy();
    });

    test("invalid cookie value, contains (:) separator", () => {
      try {
        sign(`${cookieValue}:`, "This is cookie signing secret");
      } catch (error) {
        expect(error).toEqual(
          new TypeError("cookie value cannot conatain separator(:).")
        );
      }
    });

    test("valid cookie value, contains (:) but separator as (-)", () => {
      const signedCookie = sign(`${cookieValue}:`, secret, { separator });
      const isValidCookie = verify(signedCookie, secret, { separator });
      expect(isValidCookie).toBeTruthy();
    });

    test("invalid cookie value, contains ($@$)", () => {
      try {
        sign(`${cookieValue}${cookieSignatureSeparator}`, secret);
      } catch (error) {
        expect(error).toEqual(
          new TypeError(
            `cookie value cannot conatain signature separator(${cookieSignatureSeparator}).`
          )
        );
      }
    });
  });

  describe("Verify cookie", () => {
    test("valid signature", () => {
      const isValidCookie = verify(signedCookie, secret);
      expect(isValidCookie).toBeTruthy();
    });

    test("cookie with different secret", () => {
      const isValidCookie = verify(`${signedCookie}-some-random-chars`, secret);
      expect(isValidCookie).toBeFalsy();
    });

    test("cookie with different signature", () => {
      const isValidCookie = verify(signedCookie, `${secret}-some-random-chars`);
      expect(isValidCookie).toBeFalsy();
    });
  });
});
