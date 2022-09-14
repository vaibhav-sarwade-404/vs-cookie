# vs-cookie

This is simple cookie helper for handling cookie operations.

## Usage

1. Create cookie

   Note using this function depends on browser, if combination is used that is not validated but also not accepted by browser then cookie will not be saved. Make sure of options before using this function.

```
const { createCookie } = require("@vs-org/cookie");

const cookie = createCookie({
    name: "test",
    value: "test"
  });

console.log(cookie); // test=test;Priority=Medium

```

<br/>

2. Get unsigned cookie value

```
const { getCookie } = require("@vs-org/cookie");

const cookie = getCookie("test1=test1; test=test", "test");

console.log(cookie); // "test"

```

<br/>

3. Get signed cookie value

```
const { getCookie } = require("@vs-org/cookie");

const cookie = getCookie("test1=test1; test=test.hWtzMM7E4KTirRm3N8GZ4DB5E1b9j4DVtMYh4zkwvQ", "test", {secret: "This is cookie signing secret"});

console.log(cookie); // "test%3AhWtzMM7E4KTirRm3N8GZ4DB5E1b9j4DVtMYh4zkwvQ"

```

<br/>

4. Parse all cookies

```
const { parse } = require("@vs-org/cookie");

const parsedCookies = parse("test1=test1; test=test%3AhWtzMM7E4KTirRm3N8GZ4DB5E1b9j4DVtMYh4zkwvQ");

console.log(parsedCookies); // { test1: 'test1', test: 'test%3AhWtzMM7E4KTirRm3N8GZ4DB5E1b9j4DVtMYh4zkwvQ' }

```

<br/>

5. sign cookie

```
const { sign } = require("@vs-org/cookie");

const signedCookie = sign("cookieValue","This is cookie signing secret");

console.log(signedCookie); // cookieValue%3A2V92ZahIZBNWU5aJSVZBeFNSMfNTqOl2crexQyKo

```

6. sign cookie but use different separtor

   a) Package uses `:` as default separator for cookie and cookie signature. <br/>
   b) If application has cookies containing `:` then `separator` can be passed in option to use it to sign cookie. Make sure same separator is used while verifying

```
const { sign } = require("@vs-org/cookie");

const signedCookie = sign("Cookie :test value", "This is cookie signing secret", { separator: "-" });

console.log(signedCookie); // Cookie%20%3Atest%20value-3KV68YGLG0GrgscHSlFoRyDgvzxaN3o0gT3oBTr7EM

```

<br/>

7. verify cookie signature

```
const { verify } = require("@vs-org/cookie");

const isValidCookie1 = verify("cookieValue%3A2V92ZahIZBNWU5aJSVZBeFNSMfNTqOl2crexQyKo","This is cookie signing secret");

console.log(isValidCookie1); // true


const isValidCookie2 = verify("cookieValue%3Aabcdefg","This is cookie signing secret");

console.log(isValidCookie2); // false

```

<br/>

8. verify cookie signature with different separator

   a) Package uses `:` as default separator for cookie and cookie signature. <br/>
   b) If application has signed cookies with different separator then `separator` can be passed in option which will be used for verifying signature.

```
const { verify } = require("@vs-org/cookie");

const isValidCookie1 = verify("Cookie%20%3Atest%20value-3KV68YGLG0GrgscHSlFoRyDgvzxaN3o0gT3oBTr7EM","This is cookie signing secret", { separator: "-" });

console.log(isValidCookie1); // true

```

<br/>

## Options

<br/>
1. Create cookie option

| option     | type / accepted values    | Description                                                                                                                                                                                                                                                                                                         |
| ---------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`     | string                    | Cookie name, should not contain `( ) < > @ , ; : " /[ ]?={}` or spaces                                                                                                                                                                                                                                              |
| `value`    | string                    | Cookie value                                                                                                                                                                                                                                                                                                        |
| `encode`   | function                  | By default value will be encoded with `encodeURIComponent` but if custom encoding is required this option can accept encoding function. Note encoding function should always return `string` or else there will unexpected behaviours                                                                               |
| `Path`     | string                    | Cookie path, by default current path will be assigned by browser                                                                                                                                                                                                                                                    |
| `Domain`   | string                    | Cookie domain, by default current domain will be assigned by browser                                                                                                                                                                                                                                                |
| `HttpOnly` | boolean                   | This attribute indicates, if cookie will accessible to javascript or not                                                                                                                                                                                                                                            |
| `Max-Age`  | number                    | Cookie expiry in seconds                                                                                                                                                                                                                                                                                            |
| `Prefix`   | `__Secure- , __Host-`     | Cookie prefix can be used only when secure is set as true and for HTTPs origins. `__Secure-` (this prefix cookies must be set with secure flag and from HTTPs origin), `__Host-` (can have only path as `/` and cannot have domain. Package will throw error if domain and path is provided along side this option) |
| `Priority` | `Hight, Mediym, Low`      | Prioriy can be set in Chrome browser only as of today. It helps browser decides cookie priority in order to strip cookies in case of limit exceeds                                                                                                                                                                  |
| `Secure`   | boolean                   | only send cookies with HTTPS and not HTTP                                                                                                                                                                                                                                                                           |
| `SameSite` | `true, Strict, Lax, None` | Cookies used for storing sensetive information like authentication / authenticated session should have short lifetime with SameSite as "Strict" or "Lax"                                                                                                                                                            |

<br/>

## VS Cookie function signatures

<br/>

| Name           | Function signature                                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `createCookie` | `(cookieOption: VsCookieOption) => string \| never`                                                                             |
| `getCookie`    | `(cookies: string, cookieName: string, options?: {decode?: Function; secret?: string; separator?: string;}) => string \| never` |
| `parse`        | `(cookies: string, decode: Function = decodeURIComponent) => object \| never`                                                   |
| `sign`         | `(cookie: string, secret: string, options: { separator?: string; encode?: Function }) => string \| never`                       |
| `verify`       | `(cookie: string, secret: string, options: { separator?: string; decode?: Function }) => boolean \| never`                      |

<br/>

## Note

This package is experimental and not production ready. Should only be used for developement or POC. Also this package is not actively maintained.

## License

MIT (see [LICENSE](https://github.com/vaibhav-sarwade-404/vs-cookie/blob/main/LICENSE))
