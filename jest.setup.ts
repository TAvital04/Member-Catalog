import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === "undefined") {
  (global as any).TextDecoder = TextDecoder;
}

if (typeof global.Headers === "undefined") {
  class CustomHeaders {
    private map = new Map<string, string>();
    constructor(init?: any) {
      if (init) {
        if (init instanceof Map) {
          init.forEach((v, k) => this.map.set(String(k).toLowerCase(), String(v)));
        } else {
          Object.entries(init).forEach(([k, v]) => this.map.set(k.toLowerCase(), String(v)));
        }
      }
    }
    get(name: string) { return this.map.get(name.toLowerCase()) || null; }
    set(name: string, value: string) { this.map.set(name.toLowerCase(), String(value)); }
    has(name: string) { return this.map.has(name.toLowerCase()); }
  }
  (global as any).Headers = CustomHeaders;
}

if (typeof global.Request === "undefined") {
  class CustomRequest {
    url: string;
    method: string;
    headers: any;
    private _body: any;
    constructor(input: string, init?: any) {
      this.url = input;
      this.method = init?.method || "GET";
      this.headers = init?.headers?.get ? init.headers : new Headers(init?.headers || {});
      this._body = init?.body;
    }
    async json() {
      return typeof this._body === "string" ? JSON.parse(this._body) : this._body;
    }
  }
  (global as any).Request = CustomRequest;
}

// Polyfill Response.json for App Router API Handler testing in Jest jsdom
if (typeof global.Response === "undefined" || !global.Response.json) {
  class CustomResponse {
    body: any;
    status: number;
    headers: any;
    constructor(body?: any, init?: any) {
      this.body = body;
      this.status = init?.status || 200;
      this.headers = init?.headers || {};
    }
    static json(data: any, init?: any) {
      const res = new CustomResponse(data, init);
      return res;
    }
    async json() {
      return typeof this.body === "string" ? JSON.parse(this.body) : this.body;
    }
  }
  (global as any).Response = CustomResponse;
}

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));
