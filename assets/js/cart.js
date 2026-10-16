/* =========================================================
   Justice International School — Online Textbook Ordering (DEMO PROTOTYPE)
   Demo cart engine
   ---------------------------------------------------------
   * Everything lives in this browser (localStorage). Nothing is sent
     anywhere: there is no server, no school record and no payment.
   * Money shown is a DEMO PLACEHOLDER RATE, not a price. Real prices are
     "To be confirmed by the school." and are never calculated here.
   ========================================================= */
(function () {
  "use strict";

  var CART_KEY = "jis_demo_cart_v1";
  var ORDER_KEY = "jis_demo_last_order_v1";
  var MAX_QTY = 20; /* sanity limit for the demo, not a stock figure */

  var catalog = window.JIS_CATALOGUE || { books: [], demoUnitRate: 0 };
  var RATE = catalog.demoUnitRate;

  var MSG = {
    added: "Added to the demo cart — simulation only, no order has been placed.",
    removed: "Removed from the demo cart.",
    cleared: "Demo cart cleared.",
    limit: "Demo limit reached: up to " + MAX_QTY + " copies of one title in this prototype.",
    empty: "Your demo cart is empty."
  };

  /* ---------- Helpers ---------- */
  function naira(amount) {
    var n = Math.round(Number(amount) || 0);
    return "₦" + n.toLocaleString("en-US");
  }

  function safeParse(raw) {
    try {
      var data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }

  function read() {
    var items = safeParse(window.localStorage.getItem(CART_KEY));
    var clean = [];
    items.forEach(function (item) {
      if (!item || typeof item.id !== "string") return;
      var book = catalog.byId ? catalog.byId(item.id) : null;
      if (!book) return; /* ignore anything not in the confirmed seven titles */
      var qty = parseInt(item.qty, 10);
      if (!qty || qty < 1) qty = 1;
      if (qty > MAX_QTY) qty = MAX_QTY;
      clean.push({ id: item.id, qty: qty });
    });
    return clean;
  }

  function write(items) {
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (e) {
      /* storage unavailable (private mode) — the demo still works in-page */
    }
    emit();
  }

  function emit() {
    document.dispatchEvent(new CustomEvent("jis:cart-change", { detail: { count: count() } }));
  }

  function qtyOf(id) {
    var items = read();
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) return items[i].qty;
    }
    return 0;
  }

  function add(id, amount) {
    var book = catalog.byId ? catalog.byId(id) : null;
    if (!book) return { ok: false, message: "That title is not part of this prototype." };

    var step = parseInt(amount, 10) || 1;
    var items = read();
    var found = false;
    var capped = false;

    items.forEach(function (item) {
      if (item.id !== id) return;
      found = true;
      var next = item.qty + step;
      if (next > MAX_QTY) { next = MAX_QTY; capped = true; }
      item.qty = next;
    });

    if (!found) items.push({ id: id, qty: Math.min(step, MAX_QTY) });

    write(items);
    return { ok: true, message: capped ? MSG.limit : MSG.added, capped: capped };
  }

  function setQty(id, amount) {
    var qty = parseInt(amount, 10);
    if (isNaN(qty)) return { ok: false, message: "Enter a whole number of copies." };

    var capped = false;
    if (qty < 1) qty = 1;
    if (qty > MAX_QTY) { qty = MAX_QTY; capped = true; }

    var items = read();
    items.forEach(function (item) {
      if (item.id === id) item.qty = qty;
    });
    write(items);
    return { ok: true, capped: capped, message: capped ? MSG.limit : null, qty: qty };
  }

  function remove(id) {
    var items = read().filter(function (item) { return item.id !== id; });
    write(items);
    return { ok: true, message: MSG.removed };
  }

  function clear() {
    write([]);
    return { ok: true, message: MSG.cleared };
  }

  function count() {
    return read().reduce(function (sum, item) { return sum + item.qty; }, 0);
  }

  function lines() {
    return read().map(function (item) {
      var book = catalog.byId(item.id);
      return {
        id: item.id,
        qty: item.qty,
        book: book,
        demoLineTotal: item.qty * RATE
      };
    });
  }

  function demoSubtotal() {
    return count() * RATE;
  }

  /* ---------- Demo order record (browser only) ---------- */
  function makeRef() {
    var alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    var tail = "";
    var i;
    if (window.crypto && window.crypto.getRandomValues) {
      var bytes = new Uint8Array(6);
      window.crypto.getRandomValues(bytes);
      for (i = 0; i < 6; i++) tail += alphabet[bytes[i] % alphabet.length];
    } else {
      for (i = 0; i < 6; i++) tail += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return "DEMO-JIS-" + tail;
  }

  function saveOrder(items) {
    var order = {
      ref: makeRef(),
      createdAt: new Date().toISOString(),
      status: "simulated",
      statusLabel: "SIMULATED — payment not received, no payment was processed or verified",
      rate: RATE,
      demoSubtotal: items.reduce(function (sum, l) { return sum + l.demoLineTotal; }, 0),
      copies: items.reduce(function (sum, l) { return sum + l.qty; }, 0),
      items: items.map(function (l) {
        return {
          id: l.id,
          title: l.book.title,
          series: l.book.series,
          subject: l.book.subject,
          qty: l.qty,
          demoLineTotal: l.demoLineTotal
        };
      })
    };
    try {
      window.localStorage.setItem(ORDER_KEY, JSON.stringify(order));
    } catch (e) { /* ignore */ }
    return order;
  }

  function lastOrder() {
    try {
      var raw = window.localStorage.getItem(ORDER_KEY);
      if (!raw) return null;
      var order = JSON.parse(raw);
      return order && order.ref ? order : null;
    } catch (e) {
      return null;
    }
  }

  function clearOrder() {
    try { window.localStorage.removeItem(ORDER_KEY); } catch (e) { /* ignore */ }
  }

  /* ---------- Toast ---------- */
  var toastEl = null;
  var toastTimer = null;

  function toast(message, linkText, linkHref) {
    if (!document.body) return;
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("aria-live", "polite");
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = "";
    var icon = document.createElement("span");
    icon.className = "toast-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "✓";
    var text = document.createElement("span");
    text.textContent = message;
    toastEl.appendChild(icon);
    toastEl.appendChild(text);
    if (linkText && linkHref) {
      var a = document.createElement("a");
      a.href = linkHref;
      a.textContent = linkText;
      toastEl.appendChild(a);
    }
    /* restart the transition so repeats are visible */
    toastEl.classList.remove("is-visible");
    void toastEl.offsetWidth;
    toastEl.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toastEl.classList.remove("is-visible");
    }, 4200);
  }

  /* ---------- Header / sticky cart counters ---------- */
  function paintCounters() {
    var total = count();
    var nodes = document.querySelectorAll("[data-cart-count]");
    Array.prototype.forEach.call(nodes, function (node) {
      node.textContent = String(total);
      node.hidden = total === 0;
    });
    var label = document.querySelector("[data-cart-count-label]");
    if (label) {
      label.textContent = total === 1 ? "1 copy in demo cart" : total + " copies in demo cart";
    }
  }

  /* ---------- Global "add to demo cart" handling ---------- */
  document.addEventListener("click", function (event) {
    var button = event.target.closest ? event.target.closest("[data-add-to-order]") : null;
    if (!button) return;
    event.preventDefault();
    var id = button.getAttribute("data-add-to-order");
    var result = add(id, 1);
    if (result.ok) {
      toast(result.message, "View demo cart", "cart.html");
    } else {
      toast(result.message);
    }
    paintCounters();
  });

  document.addEventListener("jis:cart-change", function () {
    paintCounters();
  });

  /* Keep multiple tabs of the demo in sync. */
  window.addEventListener("storage", function (event) {
    if (event.key !== CART_KEY) return;
    paintCounters();
    document.dispatchEvent(new CustomEvent("jis:cart-sync"));
  });

  document.addEventListener("DOMContentLoaded", paintCounters);

  window.JISCart = {
    MAX_QTY: MAX_QTY,
    MSG: MSG,
    naira: naira,
    add: add,
    setQty: setQty,
    remove: remove,
    clear: clear,
    read: read,
    count: count,
    qtyOf: qtyOf,
    lines: lines,
    demoSubtotal: demoSubtotal,
    saveOrder: saveOrder,
    lastOrder: lastOrder,
    clearOrder: clearOrder,
    toast: toast,
    paintCounters: paintCounters
  };
})();
