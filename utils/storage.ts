import Cookies from "js-cookie";
/**
 * window.localStorage Browser permanent cache
 * @method set Set up permanent cache
 * @method get Get permanent cache
 * @method remove Remove persistent cache
 * @method clear Remove all permanent caches
 */
export const Local = {
  setKey(key: string) {
    return `${key}`;
  },
  set<T>(key: string, val: T) {
    window.localStorage.setItem(Local.setKey(key), JSON.stringify(val));
  },
  get(key: string) {
    let json = <string>window.localStorage.getItem(Local.setKey(key));
    return JSON.parse(json);
  },
  remove(key: string) {
    window.localStorage.removeItem(Local.setKey(key));
  },
  clear() {
    window.localStorage.clear();
  },
};
/**
 * window.sessionStorage Browser temporary cache
 * @method set Set up temporary cache
 * @method get Get temporary cache
 * @method remove   Remove temporary cache
 * @method clear Remove all temporary caches
 */
export const Session = {
  // Set up temporary cache
  set<T>(key: string, val: T | any) {
    if (key === "token") return Cookies.set(key, val);
    window.sessionStorage.setItem(Local.setKey(key), JSON.stringify(val));
  },
  // Get temporary cache
  get(key: string) {
    if (key === "token") return Cookies.get(key);
    let json = <string>window.sessionStorage.getItem(Local.setKey(key));
    return JSON.parse(json);
  },
  // Remove temporary cache
  remove(key: string) {
    if (key === "token") return Cookies.remove(key);
    window.sessionStorage.removeItem(Local.setKey(key));
  },
  // Remove all temporary caches
  clear() {
    Cookies.remove("token");
    window.sessionStorage.clear();
  },
};
/**
 * Cookies Browser permanent cache
 * @method set Set up permanent cache
 * @method get Get permanent cache
 * @method remove Remove persistent cache
 */
