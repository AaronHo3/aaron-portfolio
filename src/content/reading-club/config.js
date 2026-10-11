/**
 * ML × Bio Reading Club: meeting settings
 * ----------------------------------------------------------------------------
 * Anything left as null is hidden on the page (no empty buttons or dead links).
 * Per-session dates and links live on each paper in ./roadmap.js.
 *
 *   cadence           Shown as-is. Only "Sunday evenings" is confirmed.
 *   timeZoneLabel     Short label shown after session times, e.g. "PT".
 *   meetingUrl        Standing video-call link for every session.
 *   discussionUrl     Standing community or chat link.
 *   codeRepoUrl       Repo collecting all companion notebooks.
 * ----------------------------------------------------------------------------
 */
export const readingClub = {
  cadence: "Sunday evenings",
  timeZoneLabel: null,
  meetingUrl: null,
  discussionUrl: null,
  codeRepoUrl: null,
  format: [
    { minutes: 10, title: "The problem", detail: "What problem does the paper solve, and why did it matter then?" },
    {
      minutes: 20,
      title: "The mechanism",
      detail: "Its central idea, worked through one important figure or equation.",
    },
    { minutes: 15, title: "Evidence and limits", detail: "What the experiments show, and where they stop." },
    {
      minutes: 15,
      title: "Biology",
      detail: "Where it applies in biology, and what would need to change to make it work there.",
    },
  ],
};
