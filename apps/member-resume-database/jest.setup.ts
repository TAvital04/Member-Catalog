import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === "undefined") {
  (global as any).TextDecoder = TextDecoder;
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
