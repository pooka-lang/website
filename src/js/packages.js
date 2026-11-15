// The packages page is built with a snapshot of Hex. In the browser, this
// asks Hex again so packages published since the last build show up too.
// If Hex cannot be reached, the snapshot stays as it is.

(function () {
  "use strict";

  var list = document.querySelector("[data-packages] [data-list]");
  if (!list || !window.fetch) return;

  var API = "https://hex.pm/api/packages?search=" + encodeURIComponent("build_tool:pooka") + "&sort=inserted_at";

  function esc(text) {
    return String(text == null ? "" : text)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function longDate(iso) {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  }

  // The same markup as src/_includes/partials/package-row.njk.
  function row(p) {
    var meta = p.meta || {};
    var links = meta.links || {};
    var repo = null;
    Object.keys(links).forEach(function (key) {
      if (!repo && /repo|source|github|gitlab|codeberg/i.test(key)) repo = links[key];
    });
    var version = p.latest_stable_version || p.latest_version;
    var licenses = meta.licenses || [];
    var downloads = (p.downloads && p.downloads.all) || 0;
    var retired = p.retirements && Object.keys(p.retirements).length;
    return (
      '<article class="package-row"><div class="about">' +
      '<div class="name"><h3><a href="' + esc(p.html_url) + '">' + esc(p.name) + '</a></h3><span class="version">v' + esc(version) + "</span>" +
      (retired ? '<span class="chip">retired</span>' : "") + "</div>" +
      "<p>" + esc(meta.description || "No description yet.") + "</p>" +
      '<div class="meta">' + (licenses.length ? "<span>" + esc(licenses.join(", ")) + "</span><span>·</span>" : "") +
      '<span>published <time datetime="' + esc(p.inserted_at) + '">' + longDate(p.inserted_at) + "</time></span>" +
      (downloads ? "<span>·</span><span>" + downloads + " downloads</span>" : "") + "</div></div>" +
      '<div class="use"><div class="add"><code>pooka add ' + esc(p.name) + '</code><button class="copy" type="button" data-copy="pooka add ' + esc(p.name) + '">Copy</button></div>' +
      '<div class="links"><a href="' + esc(p.html_url) + '">Hex</a>' +
      (p.docs_html_url ? '<a href="' + esc(p.docs_html_url) + '">Docs</a>' : "") +
      (repo ? '<a href="' + esc(repo) + '">Source</a>' : "") + "</div></div></article>"
    );
  }

  function page(number, found) {
    return fetch(API + "&page=" + number, { headers: { Accept: "application/json" } })
      .then(function (response) {
        if (!response.ok) throw new Error("Hex answered " + response.status);
        return response.json();
      })
      .then(function (batch) {
        found = found.concat(batch);
        return batch.length === 100 && number < 20 ? page(number + 1, found) : found;
      });
  }

  page(1, [])
    .then(function (packages) {
      if (!packages.length) return;
      packages.sort(function (a, b) {
        return new Date(b.inserted_at) - new Date(a.inserted_at) || a.name.localeCompare(b.name);
      });
      list.innerHTML = packages.map(row).join("");
      var total = document.querySelector("[data-total]");
      var noun = document.querySelector("[data-total-noun]");
      if (total) total.textContent = String(packages.length);
      if (noun) noun.textContent = packages.length === 1 ? "package" : "packages";
    })
    .catch(function () {});
})();
