import { describe, expect, it } from "vitest";
import { buildMailto, isPlausibleEmail } from "../src/lib/mailto.js";

const decode = (url) => {
  const [, query] = url.split("?");
  return Object.fromEntries(query.split("&").map((kv) => kv.split("=").map(decodeURIComponent)));
};

describe("contact draft mailto", () => {
  it("encodes special characters so they cannot break the URL", () => {
    const url = buildMailto("a@b.co", { name: "Ann & Bo?", message: "Hi #1\nline two" });
    expect(url.startsWith("mailto:a@b.co?subject=")).toBe(true);
    expect(url).not.toMatch(/[ \n#]/);
    const { subject, body } = decode(url);
    expect(subject).toBe("Portfolio inquiry from Ann & Bo?");
    expect(body).toBe("Name: Ann & Bo?\r\n\r\nHi #1\r\nline two");
  });

  it("keeps a blank line between the sender details and the message", () => {
    const { body } = decode(buildMailto("a@b.co", { name: "Ann", email: "ann@x.org", message: "Hello" }));
    expect(body).toBe("Name: Ann\r\nEmail: ann@x.org\r\n\r\nHello");
  });

  it("omits the header when only a message is given", () => {
    const { subject, body } = decode(buildMailto("a@b.co", { message: "Hello" }));
    expect(subject).toBe("Portfolio inquiry");
    expect(body).toBe("Hello");
  });

  it("checks email shape loosely", () => {
    expect(isPlausibleEmail("ann@x.org")).toBe(true);
    expect(isPlausibleEmail("ann@x")).toBe(false);
    expect(isPlausibleEmail("ann x@y.org")).toBe(false);
  });
});
