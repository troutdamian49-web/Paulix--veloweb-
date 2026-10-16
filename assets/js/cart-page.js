/* =========================================================
   Justice International School — Online Textbook Ordering (DEMO PROTOTYPE)
   Demo cart page
   ---------------------------------------------------------
   Quantity changes update only the affected row, the summary and the
   header count, so the number field keeps focus while it is being typed in.
   ========================================================= */
(function () {
  "use strict";

  var root = document.querySelector("[data-cart-page]");
  if (!root || !window.JISCart) return;

  var cart = window.JISCart;
  var catalog = window.JIS_CATALOGUE;

  var list = root.querySelector("[data-cart-list]");
  var emptyState = root.querySelector("[data-cart-empty]");
  var filled = root.querySelector("[data-cart-filled]");
  var itemCount = root.querySelector("[data-sum-items]");
  var copyCount = root.querySelector("[data-sum-copies]");
  var subtotal = root.querySelector("[data-sum-subtotal]");

  /* the mobile summary bar sits outside the cart panel */
  var mobileCopies = document.querySelector("[data-mobile-copies]");
  var mobileSubtotal = document.querySelector("[data-mobile-subtotal]");

  function lineTemplate(line) {
    var book = line.book;
    return '' +
      '<article class="cart-row" data-id="' + book.id + '">' +
        '<img class="row-thumb" src="' + book.cover + '" alt="" width="74" height="99" loading="lazy" decoding="async" />' +
        '<div>' +
          '<h3>' + book.title + '</h3>' +
          '<p class="row-meta">' + book.series + ' series · Subject: ' + book.subject + '</p>' +
          '<p class="row-rate">Demo placeholder rate: ' + catalog.demoUnitRateLabel +
            ' <span class="muted">(illustration only — not a price)</span></p>' +
          '<div class="row-controls">' +
            '<div class="qty">' +
              '<button type="button" data-qty-step="-1" aria-label="Reduce copies of ' + book.title + '">−</button>' +
              '<input type="number" inputmode="numeric" min="1" max="' + cart.MAX_QTY + '" step="1" value="' + line.qty +
                '" data-qty-input aria-label="Copies of ' + book.title + '" />' +
              '<button type="button" data-qty-step="1" aria-label="Add one more copy of ' + book.title + '">+</button>' +
            '</div>' +
            '<button type="button" class="remove-link" data-remove aria-label="Remove ' + book.title + ' from the demo cart">Remove</button>' +
          '</div>' +
        '</div>' +
        '<div class="row-total-cell">' +
          '<span class="small muted">Demo total</span>' +
          '<span class="row-line-total">' + cart.naira(line.demoLineTotal) + '</span>' +
        '</div>' +
      '</article>';
  }

  function paintSummary() {
    var lines = cart.lines();
    var copies = 0;
    lines.forEach(function (l) { copies += l.qty; });

    if (itemCount) itemCount.textContent = String(lines.length);
    if (copyCount) copyCount.textContent = String(copies);
    if (subtotal) subtotal.textContent = cart.naira(cart.demoSubtotal());

    if (mobileCopies) mobileCopies.textContent = copies === 1 ? "1 copy" : copies + " copies";
    if (mobileSubtotal) mobileSubtotal.textContent = cart.naira(cart.demoSubtotal());

    var hasItems = lines.length > 0;
    if (emptyState) emptyState.hidden = hasItems;
    if (filled) filled.hidden = !hasItems;
    if (list) list.hidden = !hasItems;

    cart.paintCounters();
  }

  /* full render — used on first paint, after removals and on cross-tab changes */
  function render() {
    var lines = cart.lines();
    if (list) list.innerHTML = lines.map(lineTemplate).join("");
    paintSummary();
  }

  function bookTitleFrom(row) {
    var book = catalog.byId(row.getAttribute("data-id"));
    return book ? book.title : "this title";
  }

  /* update one row's demo total without touching the rest of the DOM */
  function paintRow(row, qty) {
    var out = row.querySelector(".row-line-total");
    if (out) out.textContent = cart.naira(qty * catalog.demoUnitRate);
  }

  function applyQty(row, id, requested) {
    var previous = cart.qtyOf(id);
    var result = cart.setQty(id, requested);
    var input = row.querySelector("[data-qty-input]");

    if (!result.ok) {
      if (input) input.value = String(previous);
      cart.toast("Enter a whole number of copies (1–" + cart.MAX_QTY + " in this demo).");
      return;
    }
    if (input) input.value = String(result.qty);
    if (result.capped) cart.toast(cart.MSG.limit);
    paintRow(row, result.qty);
    paintSummary();
  }

  /* ---------- Row interactions ---------- */
  root.addEventListener("click", function (event) {
    if (!event.target.closest) return;

    var step = event.target.closest("[data-qty-step]");
    if (step) {
      var stepRow = step.closest(".cart-row");
      if (!stepRow) return;
      var stepId = stepRow.getAttribute("data-id");
      var delta = parseInt(step.getAttribute("data-qty-step"), 10) || 0;
      applyQty(stepRow, stepId, cart.qtyOf(stepId) + delta);
      return;
    }

    var removeBtn = event.target.closest("[data-remove]");
    if (removeBtn) {
      var removeRow = removeBtn.closest(".cart-row");
      if (!removeRow) return;
      var removeId = removeRow.getAttribute("data-id");
      var removedTitle = bookTitleFrom(removeRow);
      var stillThere = cart.remove(removeId).ok;
      if (stillThere) cart.toast(removedTitle + " removed from the demo cart.");
      render();
    }
  });

  root.addEventListener("change", function (event) {
    if (!event.target.closest) return;
    var input = event.target.closest("[data-qty-input]");
    if (!input) return;
    var row = input.closest(".cart-row");
    if (!row) return;
    var raw = input.value.trim();
    if (raw === "" || isNaN(parseInt(raw, 10))) {
      applyQty(row, row.getAttribute("data-id"), NaN); /* restores the previous value */
      return;
    }
    applyQty(row, row.getAttribute("data-id"), raw);
  });

  /* live totals while typing, without losing the caret */
  root.addEventListener("input", function (event) {
    if (!event.target.closest) return;
    var input = event.target.closest("[data-qty-input]");
    if (!input) return;
    var row = input.closest(".cart-row");
    if (!row) return;
    var value = parseInt(input.value, 10);
    if (isNaN(value)) return;

    if (value > cart.MAX_QTY) {
      input.value = String(cart.MAX_QTY);
      value = cart.MAX_QTY;
      cart.toast(cart.MSG.limit);
    }
    if (value < 1) return; /* wait until the field is left before forcing 1 */
    cart.setQty(row.getAttribute("data-id"), value);
    paintRow(row, value);
    paintSummary();
  });

  /* ---------- Clear cart ---------- */
  var clearButton = root.querySelector("[data-cart-clear]");
  if (clearButton) {
    clearButton.addEventListener("click", function () {
      if (!cart.count()) {
        cart.toast(cart.MSG.empty);
        return;
      }
      var proceed = window.confirm(
        "Clear every item from the demo cart?\n\nThis only clears the demo cart in this browser. No real order or payment is affected."
      );
      if (!proceed) return;
      cart.clear();
      cart.toast(cart.MSG.cleared);
      render();
    });
  }

  /* ---------- Continue to checkout guard ---------- */
  var checkoutLink = root.querySelector("[data-cart-checkout]");
  if (checkoutLink) {
    checkoutLink.addEventListener("click", function (event) {
      if (!cart.count()) {
        event.preventDefault();
        cart.toast("Add at least one title before continuing to the demo checkout.");
      }
    });
  }

  /* another tab changed the demo cart */
  document.addEventListener("jis:cart-sync", render);

  render();
})();
