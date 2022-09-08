import { createCookie, getCookie, parse, sign, verify } from "../src";

describe("Vs Cookie", () => {
  test("generate cookie", () => {
    const cookie = createCookie({ name: "test", value: "test" });
    expect(cookie).toEqual("test=test;Priority=Medium");
  });

  test("get cookie", () => {
    const cookie = getCookie(
      "test=test;test1=test1;encodedSignedCookie=Cookie%20test%20value:MNl7dgVTIKAkB2KMEv9AaVuq969eVhZqIIIAw7ZDs",
      "encodedSignedCookie"
    );
    expect(cookie).toEqual(
      "Cookie test value:MNl7dgVTIKAkB2KMEv9AaVuq969eVhZqIIIAw7ZDs"
    );
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

  test("sign cookie", () => {
    const signedCookie = sign(
      "Cookie test value",
      "This is cookie signing secret"
    );
    expect(signedCookie).toEqual(
      "Cookie%20test%20value%3AMNl7dgVTIKAkB2KMEv9AaVuq969eVhZqIIIAw7ZDs"
    );
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
  });
});
