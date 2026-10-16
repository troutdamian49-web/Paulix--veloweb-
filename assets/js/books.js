/* =========================================================
   Justice International School — Online Textbook Ordering (DEMO PROTOTYPE)
   Books page: catalogue filters + live "in demo order" indicators
   ========================================================= */
(function () {
  "use strict";

  var catalog = window.JIS_CATALOGUE;
  var grid = document.querySelector("[data-book-grid]");
  if (!catalog || !grid) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-book]"));
  var emptyState = document.querySelector("[data-books-empty]");
  var countOut = document.querySelector("[data-books-count]");
  var queryInput = document.getElementById("bookSearch");
  var subjectChips = Array.prototype.slice.call(document.querySelectorAll("[data-filter-subject]"));
  var seriesChips = Array.prototype.slice.call(document.querySelectorAll("[data-filter-series]"));
  var resetButtons = Array.prototype.slice.call(document.querySelectorAll("[data-filter-reset]"));

  var state = { subject: "all", series: "all", query: "" };

  /* ---------- Filtering ---------- */
  function haystack(book) {
    return [book.title, book.subject, book.series, book.volume || "", "textbook"]
      .join(" ")
      .toLowerCase();
  }

  function matches(book) {
    if (!book) return false;
    if (state.subject !== "all" && book.subject !== state.subject) return false;
    if (state.series !== "all" && book.series !== state.series) return false;
    if (state.query) {
      var terms = state.query.toLowerCase().split(/\s+/).filter(Boolean);
      var hay = haystack(book);
      for (var i = 0; i < terms.length; i++) {
        if (hay.indexOf(terms[i]) === -1) return false;
      }
    }
    return true;
  }

  function applyFilters() {
    var shown = 0;

    cards.forEach(function (card) {
      var book = catalog.byId(card.getAttribute("data-id"));
      var visible = matches(book);
      card.hidden = !visible;
      if (visible) shown++;
    });

    if (countOut) {
      countOut.textContent = shown === 1
        ? "Showing 1 of " + cards.length + " confirmed titles"
        : "Showing " + shown + " of " + cards.length + " confirmed titles";
    }
    if (emptyState) emptyState.hidden = shown !== 0;

    subjectChips.forEach(function (chip) {
      chip.setAttribute("aria-pressed", chip.getAttribute("data-filter-subject") === state.subject ? "true" : "false");
    });
    seriesChips.forEach(function (chip) {
      chip.setAttribute("aria-pressed", chip.getAttribute("data-filter-series") === state.series ? "true" : "false");
    });
  }

  subjectChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      state.subject = chip.getAttribute("data-filter-subject");
      applyFilters();
    });
  });

  seriesChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      state.series = chip.getAttribute("data-filter-series");
      applyFilters();
    });
  });

  if (queryInput) {
    queryInput.addEventListener("input", function () {
      state.query = queryInput.value.trim();
      applyFilters();
    });
    /* the search field lives inside a form-less toolbar; block stray submits */
    var form = queryInput.form;
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        state.query = queryInput.value.trim();
        applyFilters();
      });
    }
  }

  resetButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      state = { subject: "all", series: "all", query: "" };
      if (queryInput) queryInput.value = "";
      applyFilters();
      if (queryInput) queryInput.focus();
    });
  });

  /* ---------- "Already in the demo cart" indicators ---------- */
  function paintInOrder() {
    if (!window.JISCart) return;
    cards.forEach(function (card) {
      var id = card.getAttribute("data-id");
      var qty = window.JISCart.qtyOf(id);
      var note = card.querySelector("[data-in-order]");
      var button = card.querySelector("[data-add-to-order]");
      if (note) {
        note.hidden = qty === 0;
        note.textContent = qty === 1
          ? "1 copy is in your demo cart"
          : qty + " copies are in your demo cart";
      }
      if (button) {
        button.textContent = qty > 0 ? "Add another copy (demo)" : "Add to demo cart";
      }
    });
  }

  document.addEventListener("jis:cart-change", paintInOrder);

  /* ---------- Deep links: /books.html#<book-id> ---------- */
  function highlightFromHash() {
    var id = window.location.hash.replace("#", "");
    if (!id) return;
    var card = document.getElementById(id);
    if (!card || !card.hasAttribute("data-book")) return;
    var book = catalog.byId(id);
    /* make sure the deep-linked title is visible even if a filter hides it */
    if (book && !matches(book)) {
      state = { subject: "all", series: "all", query: "" };
      if (queryInput) queryInput.value = "";
      applyFilters();
    }
  }

  window.addEventListener("hashchange", highlightFromHash);

  applyFilters();
  paintInOrder();
  highlightFromHash();
})();
