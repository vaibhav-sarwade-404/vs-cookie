export type VsCookieOption = {
  // cookie name
  name: string;
  // cookie value
  value: string;

  /**
   * Default encoding is done with "encodeURIComponent".
   * If there is need of custom encoding by application provide a valid function which always returns string which will be assinged to cookie value
   */
  encode?: Function;

  // Cookie paths should be always `/`
  Path?: string;
  // Cookie domain
  Domain?: string;

  /**
   *  This attribute indicates, if cookie will accessible to javascript or not
   */
  HttpOnly?: boolean;

  /**
   * Indicates number of seconds until cookie is expires.
   *
   * 0 or negative number expires cookie immediately.
   *
   * Warning for session cookies many web browsers have a session restore feature that will save all
   * tabs and restore them the next time the browser is used. Session cookies will also be restored,
   * as if the browser was never closed.
   */
  "Max-Age"?: number;
  /**
   * Cookie prefix can be used only when secure is set as true and for HTTPs origins
   *
   * __Secure- --> this prefix cookies must be set with secure flag and from HTTPs origin
   * __Host- --> can have only path as `/` and cannot have domain (package will throw error if domain and path is provided along side this option)
   *
   */
  Prefix?: "__Secure-" | "__Host-";

  /**
   * Prioriy can be set in Chrome browser only as of today. It helps browser decides cookie priority in order to strip cookies in case of limit exceeds
   */
  Priority?: "High" | "Medium" | "Low";

  // only send cookies with HTTPS and not HTTP
  Secure?: boolean;
  /**
   * true --> SameSite will be assigned value "Strict"
   * Strict --> browser sends the cookie only for same-site requests
   * Lax --> cookie is not sent on cross-site requests,
   * None --> browser sends the cookie with both cross-site and same-site requests
   *
   * When using sameSite then secure also needs to be set, if this option is provided secure will be set automatically by package
   *
   * Cookies used for storing sensetive information like authentication / authenticated session should have short lifetime with
   * SameSite as "Strict" or "Lax"
   */
  SameSite?: true | "Strict" | "Lax" | "None";
};

export type GetCookieOptions = {
  decode?: (str: string) => string;
  secret?: string;
  separor?: string;
};
