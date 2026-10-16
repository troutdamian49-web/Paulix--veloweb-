/* =========================================================
   Justice International School — Online Textbook Ordering (DEMO PROTOTYPE)
   Catalogue data
   ---------------------------------------------------------
   IMPORTANT — DATA RULES FOR THIS PROTOTYPE
   * Only the seven titles confirmed for this demo are listed here.
   * No authors, editions, ISBNs, prices, class assignments or stock
     quantities are invented. Unconfirmed fields read exactly:
        "To be confirmed by the school."
   * DEMO_UNIT_RATE is a placeholder used ONLY so the demo cart maths can
     be demonstrated. It is NOT a price, NOT a quotation and NOT payable.
   ========================================================= */
(function () {
  "use strict";

  var UNCONFIRMED = "To be confirmed by the school.";

  /* Placeholder rate used only to demonstrate cart totals in this demo. */
  var DEMO_UNIT_RATE = 1000;
  var DEMO_UNIT_RATE_LABEL = "₦1,000 per book";

  var books = [
    {
      id: "new-concept-english-1",
      title: "New Concept English 1",
      series: "New Concept",
      subject: "English",
      volume: null,
      cover: "assets/img/books/new-concept-english-1.svg",
      summary:
        "Part of the New Concept English series. Author, edition, price, availability and the class that needs this title are all still to be confirmed by the school."
    },
    {
      id: "new-concept-english-2",
      title: "New Concept English 2",
      series: "New Concept",
      subject: "English",
      volume: null,
      cover: "assets/img/books/new-concept-english-2.svg",
      summary:
        "Part of the New Concept English series. Author, edition, price, availability and the class that needs this title are all still to be confirmed by the school."
    },
    {
      id: "tonad-essential-chemistry",
      title: "TONAD Essential Chemistry",
      series: "TONAD Essential",
      subject: "Chemistry",
      volume: null,
      cover: "assets/img/books/tonad-essential-chemistry.svg",
      summary:
        "Part of the TONAD Essential series. Author, edition, price, availability and the class that needs this title are all still to be confirmed by the school."
    },
    {
      id: "tonad-essential-physics",
      title: "TONAD Essential Physics",
      series: "TONAD Essential",
      subject: "Physics",
      volume: null,
      cover: "assets/img/books/tonad-essential-physics.svg",
      summary:
        "Part of the TONAD Essential series. Author, edition, price, availability and the class that needs this title are all still to be confirmed by the school."
    },
    {
      id: "new-concept-mathematics-1-volume-1",
      title: "New Concept Mathematics 1 (Volume 1)",
      series: "New Concept",
      subject: "Mathematics",
      volume: "Volume 1",
      cover: "assets/img/books/new-concept-mathematics-1.svg",
      summary:
        "Part of the New Concept Mathematics series. Author, edition, price, availability and the class that needs this title are all still to be confirmed by the school."
    },
    {
      id: "new-concept-mathematics-2-volume-2",
      title: "New Concept Mathematics 2 (Volume 2)",
      series: "New Concept",
      subject: "Mathematics",
      volume: "Volume 2",
      cover: "assets/img/books/new-concept-mathematics-2.svg",
      summary:
        "Part of the New Concept Mathematics series. Author, edition, price, availability and the class that needs this title are all still to be confirmed by the school."
    },
    {
      id: "tonad-essential-marketing",
      title: "TONAD Essential Marketing",
      series: "TONAD Essential",
      subject: "Marketing",
      volume: null,
      cover: "assets/img/books/tonad-essential-marketing.svg",
      summary:
        "Part of the TONAD Essential series. Author, edition, price, availability and the class that needs this title are all still to be confirmed by the school."
    }
  ];

  /* Class lists are intentionally empty: no title may be assigned to SS1,
     SS2 or SS3 until the school confirms the correct lists. */
  var classLists = [
    { code: "SS1", label: "SS1", status: UNCONFIRMED, titles: [] },
    { code: "SS2", label: "SS2", status: UNCONFIRMED, titles: [] },
    { code: "SS3", label: "SS3", status: UNCONFIRMED, titles: [] }
  ];

  window.JIS_CATALOGUE = {
    siteName: "Justice International School — Online Textbook Ordering",
    demoLabel: "DEMO PROTOTYPE — NOT AN OFFICIAL SCHOOL SERVICE.",
    unconfirmed: UNCONFIRMED,
    demoUnitRate: DEMO_UNIT_RATE,
    demoUnitRateLabel: DEMO_UNIT_RATE_LABEL,
    /* Provenance of the catalogue, shown to reviewers. */
    catalogueNote:
      "Seven titles are listed in this prototype. Nothing else has been added: no extra textbooks, no authors, no class lists, no stock figures and no real prices.",
    books: books,
    classLists: classLists
  };

  /* Handy lookups (kept dependency-free). */
  window.JIS_CATALOGUE.byId = function (id) {
    for (var i = 0; i < books.length; i++) {
      if (books[i].id === id) return books[i];
    }
    return null;
  };

  window.JIS_CATALOGUE.subjects = books
    .map(function (b) { return b.subject; })
    .filter(function (s, i, arr) { return arr.indexOf(s) === i; });

  window.JIS_CATALOGUE.series = books
    .map(function (b) { return b.series; })
    .filter(function (s, i, arr) { return arr.indexOf(s) === i; });
})();
