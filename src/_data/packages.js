// Every package on Hex built with Pooka, fetched while the site builds,
// most recently updated first.
//
// Hex can search by build tool: `build_tool:pooka`. The response is cached
// for an hour during local development. If Hex cannot be reached, the build
// still succeeds with an empty list and the page links to hex.pm instead;
// js/packages.js refreshes the list in the browser either way.

import Fetch from "@11ty/eleventy-fetch";

const API = "https://hex.pm/api/packages";
const QUERY = "build_tool:pooka";

function simplify(p) {
  const meta = p.meta || {};
  const links = meta.links || {};
  const repoKey = Object.keys(links).find((key) => /repo|source|github|gitlab|codeberg/i.test(key));
  return {
    name: p.name,
    version: p.latest_stable_version || p.latest_version,
    description: meta.description || "No description yet.",
    licenses: meta.licenses || [],
    hex: p.html_url,
    docs: p.docs_html_url,
    repo: repoKey ? links[repoKey] : null,
    updated: p.updated_at,
    inserted: p.inserted_at,
    downloads: (p.downloads && p.downloads.all) || 0,
    retired: Boolean(p.retirements && Object.keys(p.retirements).length)
  };
}

export default async function () {
  const all = [];
  try {
    for (let page = 1; page <= 20; page++) {
      const url = `${API}?search=${encodeURIComponent(QUERY)}&sort=updated_at&page=${page}`;
      const batch = await Fetch(url, { duration: "1h", type: "json" });
      all.push(...batch.map(simplify));
      if (batch.length < 100) break;
    }
  } catch (error) {
    console.warn(`[packages] Hex could not be reached: ${error.message}`);
    return { list: [], fetched: null, reachable: false };
  }
  // Most recently updated first: a new release moves a package to the top.
  all.sort((a, b) => new Date(b.updated) - new Date(a.updated) || a.name.localeCompare(b.name));
  return { list: all, fetched: new Date().toISOString(), reachable: true };
}
