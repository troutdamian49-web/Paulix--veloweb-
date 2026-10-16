/* =========================================================
   Justice International School — Online Textbook Ordering (DEMO PROTOTYPE)
   Demo checkout + simulated order confirmation
   ---------------------------------------------------------
   NOTHING IS TRANSMITTED. There is no payment gateway and no school
   database behind this prototype. Orders exist only in this browser and
   their references and payment statuses are explicitly simulated.
   ========================================================= */
(function () {
  "use strict";

  var cart = window.JISCart;
  var catalog = window.JIS_CATALOGUE;
  if (!cart || !catalog) return;

  function formatDate(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return "—";
    try {
      return d.toLocaleString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit"
      });
    } catch (e) {
      return d.toISOString();
    }
  }

  /* =======================================================
     Checkout page
     ======================================================= */
  var checkout = document.querySelector("[data-checkout-page]");
  if (checkout) {
    var list = checkout.querySelector("[data-checkout-list]");
    var emptyState = checkout.querySelector("[data-checkout-empty]");
    var filled = checkout.querySelector("[data-checkout-filled]");
    var itemsOut = checkout.querySelector("[data-checkout-items]");
    var copiesOut = checkout.querySelector("[data-checkout-copies]");
    var subtotalOut = checkout.querySelector("[data-checkout-subtotal]");
    var ack = checkout.querySelector("[data-ack]");
    var placeButton = checkout.querySelector("[data-place-order]");
    var warning = checkout.querySelector("[data-ack-warning]");

    function paintCheckout() {
      var lines = cart.lines();
      var copies = lines.reduce(function (sum, l) { return sum + l.qty; }, 0);

      if (list) {
        list.innerHTML = lines.map(function (l) {
          return '' +
            '<li>' +
              '<span class="co-title">' + l.book.title + '</span>' +
              '<span class="co-amount">' + cart.naira(l.demoLineTotal) + '</span>' +
              '<span class="co-meta">' + l.book.series + ' series · Subject: ' + l.book.subject +
                ' · ' + l.qty + (l.qty === 1 ? ' copy' : ' copies') + ' · demo placeholder rate ' +
                catalog.demoUnitRateLabel + '</span>' +
              '<span class="co-meta" style="text-align:right">Amount payable: ' + catalog.unconfirmed + '</span>' +
            '</li>';
        }).join("");
      }

      if (itemsOut) itemsOut.textContent = String(lines.length);
      if (copiesOut) copiesOut.textContent = String(copies);
      if (subtotalOut) subtotalOut.textContent = cart.naira(cart.demoSubtotal());

      var hasItems = lines.length > 0;
      if (emptyState) emptyState.hidden = hasItems;
      if (filled) filled.hidden = !hasItems;
      updatePlaceButton();
      cart.paintCounters();
    }

    function updatePlaceButton() {
      if (!placeButton) return;
      var ready = cart.count() > 0 && (!ack || ack.checked);
      placeButton.disabled = !ready;
      placeButton.setAttribute("aria-disabled", ready ? "false" : "true");
      if (warning) {
        warning.hidden = !ack || ack.checked || cart.count() === 0;
      }
    }

    if (ack) {
      ack.addEventListener("change", updatePlaceButton);
    }

    if (placeButton) {
      placeButton.addEventListener("click", function () {
        if (!cart.count()) {
          cart.toast("Your demo cart is empty — add a title first.");
          return;
        }
        if (ack && !ack.checked) {
          cart.toast("Please tick the acknowledgement box before placing the demo order.");
          updatePlaceButton();
          if (ack) ack.focus();
          return;
        }
        var lines = cart.lines();
        cart.saveOrder(lines);
        cart.clear();
        window.location.href = "order.html";
      });
    }

    document.addEventListener("jis:cart-change", paintCheckout);
    paintCheckout();
  }

  /* =======================================================
     Simulated order confirmation page
     ======================================================= */
  var orderPage = document.querySelector("[data-order-page]");
  if (orderPage) {
    var emptyOrder = orderPage.querySelector("[data-order-empty]");
    var filledOrder = orderPage.querySelector("[data-order-filled]");
    var order = cart.lastOrder();

    if (!order) {
      if (emptyOrder) emptyOrder.hidden = false;
      if (filledOrder) filledOrder.hidden = true;
    } else {
      if (emptyOrder) emptyOrder.hidden = true;
      if (filledOrder) filledOrder.hidden = false;

      var refOut = orderPage.querySelector("[data-order-ref]");
      var dateOut = orderPage.querySelector("[data-order-date]");
      var copiesOut2 = orderPage.querySelector("[data-order-copies]");
      var itemsOut2 = orderPage.querySelector("[data-order-items]");
      var subOut = orderPage.querySelector("[data-order-subtotal]");
      var listOut = orderPage.querySelector("[data-order-list]");
      var statusOut = orderPage.querySelector("[data-order-status]");

      if (refOut) refOut.textContent = order.ref;
      if (dateOut) dateOut.textContent = formatDate(order.createdAt);
      if (copiesOut2) copiesOut2.textContent = String(order.copies || 0);
      if (itemsOut2) itemsOut2.textContent = String((order.items || []).length);
      if (subOut) subOut.textContent = cart.naira(order.demoSubtotal || 0);
      if (statusOut) {
        statusOut.textContent = "SIMULATED — no payment was received or verified";
      }

      if (listOut) {
        listOut.innerHTML = (order.items || []).map(function (item) {
          return '' +
            '<li>' +
              '<span class="co-title">' + item.title + '</span>' +
              '<span class="co-amount">' + cart.naira(item.demoLineTotal) + '</span>' +
              '<span class="co-meta">' + item.series + ' series · Subject: ' + item.subject +
                ' · ' + item.qty + (item.qty === 1 ? ' copy' : ' copies') + '</span>' +
              '<span class="co-meta" style="text-align:right">Amount payable: ' + catalog.unconfirmed + '</span>' +
            '</li>';
        }).join("");
      }
    }

    var printButton = orderPage.querySelector("[data-order-print]");
    if (printButton) {
      printButton.addEventListener("click", function () {
        window.print();
      });
    }

    var clearOrderButton = orderPage.querySelector("[data-order-clear]");
    if (clearOrderButton) {
      clearOrderButton.addEventListener("click", function () {
        var proceed = window.confirm(
          "Remove this simulated demo order from this browser?\n\nNothing was ever sent to Justice International School, so nothing else is affected."
        );
        if (!proceed) return;
        cart.clearOrder();
        window.location.reload();
      });
    }
  }

  /* =======================================================
     Home page demo "cart in progress" note (optional element)
     ======================================================= */
  var homeNote = document.querySelector("[data-home-cart-note]");
  if (homeNote) {
    var paintHomeNote = function () {
      var total = cart.count();
      homeNote.hidden = total === 0;
      var out = homeNote.querySelector("[data-home-copies]");
      if (out) out.textContent = String(total);
    };
    document.addEventListener("jis:cart-change", paintHomeNote);
    paintHomeNote();
  }
})();
