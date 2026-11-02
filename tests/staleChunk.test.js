import { describe, expect, it, vi } from "vitest";
import {
  CHUNK_RELOAD_KEY,
  clearChunkReload,
  isChunkLoadError,
  recoverFromStaleChunk,
} from "../src/lib/staleChunk.js";

/** Minimal sessionStorage stand-in; the real one is absent in the node env. */
function fakeStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
  };
}

const deniedStorage = {
  getItem: () => { throw new Error("denied"); },
  setItem: () => { throw new Error("denied"); },
  removeItem: () => { throw new Error("denied"); },
};

/** What browsers actually throw when a chunk is gone after a deploy. */
const chunkError = () => new TypeError("Failed to fetch dynamically imported module: /assets/Blog-abc123.js");

describe("isChunkLoadError", () => {
  it("recognises the message from every major browser", () => {
    const messages = [
      "Failed to fetch dynamically imported module: /assets/Blog-abc.js", // Chrome
      "error loading dynamically imported module", // Firefox
      "Importing a module script failed.", // Safari
      "Unable to preload CSS for /assets/Blog-abc.css", // Vite's preload helper
    ];
    for (const m of messages) expect(isChunkLoadError(new TypeError(m))).toBe(true);
  });

  it("ignores unrelated errors", () => {
    expect(isChunkLoadError(new Error("Cannot read properties of undefined"))).toBe(false);
    expect(isChunkLoadError(undefined)).toBe(false);
  });
});

describe("recoverFromStaleChunk", () => {
  it("reloads at the route the reader was heading to, not the one they are on", () => {
    const storage = fakeStorage();
    const go = vi.fn();
    expect(recoverFromStaleChunk(chunkError(), "/blog", { storage, go })).toBe(true);
    expect(go).toHaveBeenCalledWith("/blog");
    expect(storage.getItem(CHUNK_RELOAD_KEY)).toBe("1");
  });

  it("carries the full path so a post link lands on that post", () => {
    const go = vi.fn();
    recoverFromStaleChunk(chunkError(), "/blog/reading-ddpm-predicting-noise", { storage: fakeStorage(), go });
    expect(go).toHaveBeenCalledWith("/blog/reading-ddpm-predicting-noise");
  });

  it("gives up instead of looping when the retry also fails", () => {
    const go = vi.fn();
    const storage = fakeStorage({ [CHUNK_RELOAD_KEY]: "1" });
    expect(recoverFromStaleChunk(chunkError(), "/blog", { storage, go })).toBe(false);
    expect(go).not.toHaveBeenCalled();
  });

  it("leaves errors that are not a missing chunk alone", () => {
    const go = vi.fn();
    expect(recoverFromStaleChunk(new Error("boom"), "/blog", { storage: fakeStorage(), go })).toBe(false);
    expect(go).not.toHaveBeenCalled();
  });

  it("still recovers when storage is unavailable, as in private browsing", () => {
    const go = vi.fn();
    expect(recoverFromStaleChunk(chunkError(), "/blog", { storage: deniedStorage, go })).toBe(true);
    expect(go).toHaveBeenCalledTimes(1);
  });
});

describe("clearChunkReload", () => {
  it("clears the flag so a later deploy can recover too", () => {
    const storage = fakeStorage({ [CHUNK_RELOAD_KEY]: "1" });
    clearChunkReload(storage);
    expect(storage.getItem(CHUNK_RELOAD_KEY)).toBeNull();
  });

  it("does not throw when storage is unavailable", () => {
    expect(() => clearChunkReload(deniedStorage)).not.toThrow();
  });
});
