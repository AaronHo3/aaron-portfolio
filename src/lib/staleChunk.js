/**
 * Recovering from a stale deploy.
 * ----------------------------------------------------------------------------
 * Blog pages are lazy-loaded, so each lives in its own hashed chunk
 * (assets/Blog-<hash>.js). A deploy renames those chunks and deletes the old
 * ones, but a tab opened before the deploy still holds the previous main
 * bundle, which asks for filenames that no longer exist. The import rejects,
 * vue-router abandons the navigation, and the link looks dead: clicking
 * "Writing" does nothing at all.
 *
 * The cure is to reload, because the browser then revalidates index.html and
 * picks up the current bundle. Reloading the page we are still standing on
 * would drop the reader back where they started, so we point the address at
 * where they were trying to go and reload that instead. A session flag keeps a
 * genuinely missing chunk from looping.
 */

export const CHUNK_RELOAD_KEY = "chunk-reload";

/** Messages browsers use when a dynamic import or its CSS cannot be fetched. */
const CHUNK_ERROR = /dynamically imported module|importing a module script failed|unable to preload css|error loading dynamically/i;

/** @param {unknown} error @returns {boolean} */
export function isChunkLoadError(error) {
  return CHUNK_ERROR.test(String(error?.message ?? ""));
}

/** sessionStorage throws in some privacy modes, so every access is guarded. */
function readFlag(storage) {
  try {
    return storage?.getItem(CHUNK_RELOAD_KEY) ?? null;
  } catch {
    return null;
  }
}

function writeFlag(storage) {
  try {
    storage?.setItem(CHUNK_RELOAD_KEY, "1");
  } catch {
    // Without storage we may reload twice; the browser's own cache stops there.
  }
}

/**
 * Clear the guard after a successful navigation, so a later deploy can recover
 * in the same session.
 * @param {Storage} [storage]
 */
export function clearChunkReload(storage = globalThis.sessionStorage) {
  try {
    storage?.removeItem(CHUNK_RELOAD_KEY);
  } catch {
    // Nothing to clear if storage is unavailable.
  }
}

/**
 * Handle a failed navigation caused by a chunk that no longer exists.
 *
 * @param {unknown} error        the error vue-router reported
 * @param {string} [targetPath]  the route the reader was heading to, e.g. "/blog"
 * @param {{ storage?: Storage, go?: (path: string) => void }} [deps] injected for tests
 * @returns {boolean} true when a recovery reload was started
 */
export function recoverFromStaleChunk(error, targetPath, deps = {}) {
  const storage = deps.storage ?? globalThis.sessionStorage;
  if (!isChunkLoadError(error) || readFlag(storage)) return false;
  writeFlag(storage);
  (deps.go ?? reloadAt)(targetPath);
  return true;
}

/**
 * Put the destination in the address bar, then reload so the document (and the
 * bundle it names) is fetched fresh. Setting a hash alone never reloads, which
 * is why both steps are needed.
 * @param {string} [targetPath]
 */
function reloadAt(targetPath) {
  const { location } = globalThis;
  if (targetPath) location.hash = targetPath.startsWith("#") ? targetPath : `#${targetPath}`;
  location.reload();
}
