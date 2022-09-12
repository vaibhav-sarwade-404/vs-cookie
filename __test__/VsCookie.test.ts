import { createCookie, getCookie, parse, sign, verify } from "../src";

describe("Vs Cookie", () => {
  test("generate cookie", () => {
    const cookie = createCookie({ name: "test", value: "test" });
    expect(cookie).toEqual("test=test;Priority=Medium");
  });

  describe("get cookie", () => {
    test("with signature if present", () => {
      const cookie = getCookie(
        "test=test;test1=test1;encodedSignedCookie=Cookie%20test%20value:MNl7dgVTIKAkB2KMEv9AaVuq969eVhZqIIIAw7ZDs",
        "encodedSignedCookie"
      );
      expect(cookie).toEqual(
        "Cookie test value:MNl7dgVTIKAkB2KMEv9AaVuq969eVhZqIIIAw7ZDs"
      );
    });

    test("with signature if present, signed with seperator as `-`", () => {
      const signedCookie = sign(
        "Cookie test :value",
        "This is cookie signing secret",
        {
          separator: "-"
        }
      );
      const cookie = getCookie(
        `test=test;test1=test1;encodedSignedCookie=${signedCookie}`,
        "encodedSignedCookie",
        { separor: "-", secret: "This is cookie signing secret" }
      );
      expect(cookie).toEqual("Cookie test :value");
    });

    test("without signature, verified if present", () => {
      const cookie = getCookie(
        "test=test;test1=test1;encodedSignedCookie=Cookie%20test%20value:MNl7dgVTIKAkB2KMEv9AaVuq969eVhZqIIIAw7ZDs",
        "encodedSignedCookie",
        {
          secret: "This is cookie signing secret"
        }
      );
      expect(cookie).toEqual("Cookie test value");
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
      const signedCookie = sign(
        "Cookie test value",
        "This is cookie signing secret"
      );
      expect(signedCookie).toEqual(
        "Cookie%20test%20value%3AMNl7dgVTIKAkB2KMEv9AaVuq969eVhZqIIIAw7ZDs"
      );
    });

    test("invalid cookie value, contains (:) separator", () => {
      try {
        const signedCookie = sign(
          "Cookie :test value",
          "This is cookie signing secret"
        );
      } catch (error) {
        expect(error).toEqual(
          new TypeError("cookie value cannot conatain separator(:).")
        );
      }
    });

    test("valid cookie value, contains (:) but separator as (-)", () => {
      const signedCookie = sign(
        "Cookie :test value",
        "This is cookie signing secret",
        { separator: "-" }
      );
      expect(signedCookie).toEqual(
        "Cookie%20%3Atest%20value-3KV68YGLG0GrgscHSlFoRyDgvzxaN3o0gT3oBTr7EM"
      );
    });
  });

  describe("Verify cookie", () => {
    test("valid signature", () => {
      const isValidCookie = verify(
        "Cookie%20test%20value%3AMNl7dgVTIKAkB2KMEv9AaVuq969eVhZqIIIAw7ZDs",
        "This is cookie signing secret"
      );
      expect(isValidCookie).toBeTruthy();
    });

    test("cookie with different secret", () => {
      const isValidCookie = verify(
        "Cookie%20test%20value%3AMNl7dgVTIKAkB2KMEv9AaVuq969eVhZqIIIAw7ZDs",
        "This is different cookie signing secret"
      );
      expect(isValidCookie).toBeFalsy();
    });

    test("cookie with different signature", () => {
      const isValidCookie = verify(
        "test%3AdifferentSignature",
        "This is cookie signing secret"
      );
      expect(isValidCookie).toBeFalsy();
    });

    test("cookie signature with different separator", () => {
      const isValidCookie = verify(
        "Cookie%20%3Atest%20value-3KV68YGLG0GrgscHSlFoRyDgvzxaN3o0gT3oBTr7EM",
        "This is cookie signing secret",
        { separator: "-" }
      );
      expect(isValidCookie).toBeTruthy();
    });
  });
});
