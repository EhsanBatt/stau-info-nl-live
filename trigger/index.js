/**
 * Zuverlässiger 5-Minuten-Takt für stau-info.nl.
 *
 * GitHub startet geplante Workflows („schedule“) oft stark verspätet. Dieser
 * Cloudflare Worker läuft per Cron-Trigger exakt alle 5 Minuten und startet den
 * Workflow „Live-Daten“ per workflow_dispatch, worauf GitHub sofort reagiert.
 *
 * Secret GH_TOKEN: Fine-grained Token, nur „Actions: Read and write“ auf
 * EhsanBatt/stau-info-nl-live. Der Worker hat keine öffentliche URL.
 */
const URL = "https://api.github.com/repos/EhsanBatt/stau-info-nl-live/actions/workflows/live.yml/dispatches";

export default {
  async scheduled(_event, env) {
    const res = await fetch(URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GH_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "stau-info-trigger",
      },
      body: JSON.stringify({ ref: "main" }),
    });
    if (!res.ok) console.error(`workflow_dispatch fehlgeschlagen: HTTP ${res.status} ${await res.text()}`);
  },
};
