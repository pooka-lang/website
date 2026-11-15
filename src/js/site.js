// Pooka website: small enhancements shared by every page. Code is
// highlighted when the site is built, so everything here is optional and the
// pages read fine without JavaScript.

(function () {
  "use strict";

  // -------------------------------------------------------------- Copy buttons

  function copyText(button, text) {
    var done = function () {
      var label = button.textContent;
      button.textContent = "Copied";
      button.classList.add("copied");
      setTimeout(function () {
        button.textContent = label;
        button.classList.remove("copied");
      }, 1400);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done);
  }

  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-copy]");
    if (!button) return;
    var value = button.getAttribute("data-copy");
    if (!value) {
      var target = button.parentElement.querySelector("code");
      value = target ? target.textContent : "";
    }
    copyText(button, value.trim());
  });

  // ------------------------------------------------------------------ Nav

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  // ------------------------------------------------------------------ Tabs

  document.querySelectorAll("[data-tabs]").forEach(function (root) {
    var buttons = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var select = function (chosen) {
      buttons.forEach(function (button) {
        var on = button === chosen;
        button.setAttribute("aria-selected", String(on));
        button.tabIndex = on ? 0 : -1;
        document.getElementById(button.getAttribute("aria-controls")).hidden = !on;
      });
    };
    buttons.forEach(function (button, index) {
      button.addEventListener("click", function () {
        select(button);
      });
      button.addEventListener("keydown", function (event) {
        var step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
        if (!step) return;
        event.preventDefault();
        var next = buttons[(index + step + buttons.length) % buttons.length];
        select(next);
        next.focus();
      });
    });
  });

  // -------------------------------------------------- Filtering lists (news,
  // cookbook): [data-filter-list] holds items with data-tags and data-text.

  document.querySelectorAll("[data-filter-root]").forEach(function (root) {
    var items = Array.prototype.slice.call(root.querySelectorAll("[data-tags]"));
    var groups = Array.prototype.slice.call(root.querySelectorAll("[data-group]"));
    var input = root.querySelector("[data-filter-search]");
    var chips = Array.prototype.slice.call(root.querySelectorAll("[data-filter-tag]"));
    var count = root.querySelector("[data-filter-count]");
    var empty = root.querySelector("[data-filter-empty]");
    var tag = "all";

    var apply = function () {
      var query = input ? input.value.trim().toLowerCase() : "";
      var shown = 0;
      items.forEach(function (item) {
        var tags = item.getAttribute("data-tags").split(" ");
        var text = (item.getAttribute("data-text") || item.textContent).toLowerCase();
        var visible = (tag === "all" || tags.indexOf(tag) !== -1) && text.indexOf(query) !== -1;
        item.hidden = !visible;
        if (visible) shown += 1;
      });
      groups.forEach(function (group) {
        group.hidden = !group.querySelector("[data-tags]:not([hidden])");
      });
      if (count) {
        var noun = (count.getAttribute("data-filter-count") || "item,items").split(",");
        count.textContent = shown + " " + (shown === 1 ? noun[0] : noun[1]);
      }
      if (empty) empty.hidden = shown !== 0;
    };

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        tag = chip.getAttribute("data-filter-tag");
        chips.forEach(function (other) {
          other.setAttribute("aria-pressed", String(other === chip));
        });
        apply();
      });
    });
    if (input) input.addEventListener("input", apply);
    apply();
  });

  // "/" focuses the first search box on the page.
  document.addEventListener("keydown", function (event) {
    if (event.key !== "/" || /input|textarea|select/i.test(document.activeElement.tagName)) return;
    var search = document.querySelector(".search input");
    if (search) {
      event.preventDefault();
      search.focus();
    }
  });

})();

// Tour: mark the chapter being read in the chapter list.
(function () {
  "use strict";
  var links = Array.prototype.slice.call(document.querySelectorAll(".tour-nav a[href^='#']"));
  if (!links.length || !("IntersectionObserver" in window)) return;
  var byId = {};
  links.forEach(function (link) { byId[link.getAttribute("href").slice(1)] = link; });
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      links.forEach(function (link) { link.classList.remove("active"); });
      var link = byId[entry.target.id];
      if (link) link.classList.add("active");
    });
  }, { rootMargin: "-80px 0px -75% 0px" });
  Object.keys(byId).forEach(function (id) {
    var heading = document.getElementById(id);
    if (heading) observer.observe(heading);
  });
})();
