/**
 * Kneaded with Love — order intake
 *
 * Paste this file into a container-bound Apps Script on the Orders spreadsheet
 * (Extensions → Apps Script). Then Deploy → New deployment → Web app:
 *   Execute as: Me
 *   Who has access: Anyone
 *
 * The site POSTs JSON (text/plain) to the web app URL. This script:
 *   1. Appends a row to the Orders sheet
 *   2. Emails the bakery
 *   3. Emails the customer a confirmation
 *
 * The web app is public, so the request is treated as untrusted input: every
 * email body is composed here from validated fields. Never email a string that
 * came from the request, or this becomes an open relay for sending mail as the
 * bakery.
 */

const CONFIG = {
  SHEET_NAME: "Orders",
  BAKERY_EMAIL: "hello@kneadedwithlove.com",
  TIMEZONE: "America/New_York",
  BRAND_NAME: "Kneaded with Love",
  BRAND_PHONE: "(917) 671-7674",
  /** Keep in sync with PAYMENT.venmoUsername in src/constants.ts */
  VENMO_USERNAME: "veronica-sabeh",
  BRAND_INSTAGRAM: "@kneadedwithlovefl",
  WEBSITE: "https://kneadedwithlove.com",
  /** Keep in sync with PICKUP_DAYS in src/constants.ts */
  PICKUP_DAYS: ["Thursday", "Sunday"],
  /** Keep in sync with PAYMENT_METHODS in src/constants.ts */
  PAYMENT_LABELS: {
    zelle: "Zelle",
    venmo: "Venmo",
    pickup: "Pay at pickup",
  },
  /** Keep in sync with priceUsd in src/data/menu.ts */
  PRICES: {
    "Classic Country": 12,
    "Za'atar": 16,
    "Olive & Feta": 16,
    "Everything Bagel": 15,
    "Chocolate Chip": 15,
    Nutella: 16,
    "Dark Chocolate Chip Sourdough": 10,
    "S'mores": 10,
  },
  MAX_ORDERS_PER_HOUR: 20,
  MAX_ITEM_QUANTITY: 20,
  MAX_DISTINCT_ITEMS: 30,
  HEADERS: [
    "Timestamp",
    "Status",
    "Name",
    "Phone",
    "Email",
    "Pickup day",
    "Payment",
    "Items",
    "Estimated total",
    "Message",
    "Source",
  ],
};

function doGet() {
  return json_({ ok: true, service: "kneaded-with-love-order-intake" });
}

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    // Serialize submissions so the rate limit and row append stay consistent.
    lock.waitLock(15000);

    const data = parseBody_(e);

    // Honeypot: pretend success so bots do not retry
    if (cleanLine_(data.honeypot, 200)) {
      return json_({ ok: true });
    }

    const order = normalizeOrder_(data);

    enforceRateLimit_();

    // Fail loudly rather than silently skipping the customer confirmation.
    if (MailApp.getRemainingDailyQuota() < 2) {
      throw new Error("Daily email quota is exhausted; order was not recorded.");
    }

    appendOrderRow_(order);
    sendBakeryEmail_(order);
    sendCustomerEmail_(order);

    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  } finally {
    // releaseLock() throws if waitLock() never acquired it.
    try {
      lock.releaseLock();
    } catch (releaseErr) {
      console.error(releaseErr);
    }
  }
}

function parseBody_(e) {
  if (e && e.postData && e.postData.contents) {
    try {
      const parsed = JSON.parse(e.postData.contents);
      if (parsed && typeof parsed === "object") return parsed;
    } catch (_err) {
      return (e && e.parameter) || {};
    }
  }
  return (e && e.parameter) || {};
}

/** Collapse to a single trimmed line and cap length. */
function cleanLine_(value, maxLength) {
  return String(value === null || value === undefined ? "" : value)
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

/** Preserve line breaks, drop other control characters, and cap length. */
function cleanBlock_(value, maxLength) {
  return String(value === null || value === undefined ? "" : value)
    .replace(/\r\n?/g, "\n")
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, maxLength);
}

function normalizeOrder_(data) {
  const name = cleanLine_(data.name, 80);
  const phone = cleanLine_(data.phone, 30);
  const email = cleanLine_(data.email, 254);
  const pickupDay = cleanLine_(data.pickupDay, 40);
  const paymentMethod = cleanLine_(data.paymentMethod, 20).toLowerCase();
  const message = cleanBlock_(data.message, 2000);
  const source = cleanLine_(data.source, 200);

  if (!name) throw new Error("Missing required field: name");
  if (!phone) throw new Error("Missing required field: phone");
  if (!email) throw new Error("Missing required field: email");
  if (!message) throw new Error("Missing required field: message");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Invalid email");
  }
  if (CONFIG.PICKUP_DAYS.indexOf(pickupDay) === -1) {
    throw new Error("Invalid pickup day");
  }
  if (!Object.prototype.hasOwnProperty.call(CONFIG.PAYMENT_LABELS, paymentMethod)) {
    throw new Error("Invalid payment method");
  }

  const items = normalizeItems_(data.items);

  return {
    name: name,
    phone: phone,
    email: email,
    pickupDay: pickupDay,
    paymentMethod: paymentMethod,
    paymentLabel: CONFIG.PAYMENT_LABELS[paymentMethod],
    items: items,
    total: items.reduce(function (sum, item) {
      return sum + (item.lineTotal || 0);
    }, 0),
    hasUnpricedItem: items.some(function (item) {
      return item.lineTotal === null;
    }),
    message: message,
    source: source,
  };
}

/**
 * Quantities and prices are recomputed from CONFIG.PRICES so a tampered
 * request cannot dictate the total. An item missing from PRICES (menu changed
 * but this script was not redeployed) is kept but flagged for manual pricing.
 */
function normalizeItems_(rawItems) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new Error("Order has no items");
  }
  if (rawItems.length > CONFIG.MAX_DISTINCT_ITEMS) {
    throw new Error("Order has too many items");
  }

  const items = [];

  for (let i = 0; i < rawItems.length; i++) {
    const raw = rawItems[i] || {};
    const name = cleanLine_(raw.name, 100);
    if (!name) continue;

    const quantity = Math.floor(Number(raw.quantity));
    if (!isFinite(quantity) || quantity < 1 || quantity > CONFIG.MAX_ITEM_QUANTITY) {
      throw new Error("Invalid quantity for " + name);
    }

    const unitPrice = Object.prototype.hasOwnProperty.call(CONFIG.PRICES, name)
      ? CONFIG.PRICES[name]
      : null;

    items.push({
      name: name,
      quantity: quantity,
      unitPrice: unitPrice,
      lineTotal: unitPrice === null ? null : unitPrice * quantity,
    });
  }

  if (!items.length) throw new Error("Order has no items");

  return items;
}

/**
 * Caps how many orders the public endpoint can process per hour. Apps Script
 * cannot see the caller IP, so this is a global ceiling that bounds the damage
 * from abuse rather than per-sender throttling.
 */
function enforceRateLimit_() {
  const cache = CacheService.getScriptCache();
  const key = "order-count-" + Math.floor(Date.now() / (60 * 60 * 1000));
  const current = Number(cache.get(key) || 0);

  if (current >= CONFIG.MAX_ORDERS_PER_HOUR) {
    throw new Error("Too many orders were submitted in the last hour. Please text us instead.");
  }

  // 65 minutes, so the window always outlives the hour bucket it belongs to.
  cache.put(key, String(current + 1), 65 * 60);
}

function formatUsd_(amount) {
  return "$" + Number(amount).toFixed(2);
}

function describeItem_(item) {
  const quantity = item.quantity + " x " + item.name;
  if (item.lineTotal === null) {
    return quantity + " (price TBD)";
  }
  return quantity + " (" + formatUsd_(item.unitPrice) + " each) = " + formatUsd_(item.lineTotal);
}

function orderSummary_(order) {
  return order.items
    .map(function (item) {
      return item.quantity + " x " + item.name;
    })
    .join(", ");
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(CONFIG.HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, CONFIG.HEADERS.length).setFontWeight("bold");

    const statusRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(["New", "Confirmed", "Paid", "Ready", "Picked up", "Cancelled"], true)
      .setAllowInvalid(false)
      .build();
    sheet.getRange("B2:B").setDataValidation(statusRule);
    sheet.setColumnWidths(1, CONFIG.HEADERS.length, 140);
    sheet.setColumnWidth(8, 280);
    sheet.setColumnWidth(10, 260);
  }

  return sheet;
}

function appendOrderRow_(order) {
  const timestamp = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss");

  getSheet_().appendRow([
    timestamp,
    "New",
    order.name,
    order.phone,
    order.email,
    order.pickupDay,
    order.paymentLabel,
    orderSummary_(order),
    formatUsd_(order.total) + (order.hasUnpricedItem ? " + items priced manually" : ""),
    order.message,
    order.source,
  ]);
}

function sendBakeryEmail_(order) {
  const lines = [
    "New " + CONFIG.BRAND_NAME + " order request",
    "",
    "Name: " + order.name,
    "Phone / Text: " + order.phone,
    "Customer email: " + order.email,
    "Pickup day: " + order.pickupDay,
    "Payment: " + order.paymentLabel,
    "",
    "Order:",
  ]
    .concat(
      order.items.map(function (item) {
        return "- " + describeItem_(item);
      }),
    )
    .concat([
      "Estimated total: " + formatUsd_(order.total),
    ]);

  if (order.hasUnpricedItem) {
    lines.push("NOTE: an item is not in this script's price list — confirm its price manually.");
  }

  lines.push("", "Message / special requests:", order.message);

  if (order.source) {
    lines.push("", "Submitted from: " + order.source);
  }

  MailApp.sendEmail({
    to: CONFIG.BAKERY_EMAIL,
    replyTo: order.email,
    name: CONFIG.BRAND_NAME,
    subject: "New order request from " + order.name,
    body: lines.join("\n"),
  });
}

function paymentNote_(order) {
  if (order.paymentMethod === "zelle") {
    return (
      "You chose Zelle. After we confirm, please send payment to " +
      CONFIG.BRAND_PHONE +
      " (" +
      CONFIG.BRAND_NAME +
      ")."
    );
  }
  if (order.paymentMethod === "venmo") {
    return (
      "You chose Venmo. After we confirm, please send payment to @" +
      CONFIG.VENMO_USERNAME +
      "."
    );
  }
  return "You chose to pay at pickup. Cash, Zelle, or Venmo are all welcome then.";
}

function sendCustomerEmail_(order) {
  const lines = [
    "Hi " + order.name + ",",
    "",
    "Thank you for your order request from " + CONFIG.BRAND_NAME + "!",
    "",
    "We received your order and will contact you within 6 hours to confirm your pickup date.",
    "",
    "Your request:",
  ]
    .concat(
      order.items.map(function (item) {
        return "- " + describeItem_(item);
      }),
    )
    .concat([
      "Estimated total: " + formatUsd_(order.total),
      "Pickup day: " + order.pickupDay,
      "",
      paymentNote_(order),
      "",
      "Please wait until we confirm your order before sending payment.",
      "",
      "We cannot wait to bake something sweet and special for you!",
      "",
      CONFIG.BRAND_NAME,
      CONFIG.BRAND_PHONE,
      CONFIG.BRAND_INSTAGRAM,
    ]);

  MailApp.sendEmail({
    to: order.email,
    replyTo: CONFIG.BAKERY_EMAIL,
    name: CONFIG.BRAND_NAME,
    subject: "We received your " + CONFIG.BRAND_NAME + " order request",
    body: lines.join("\n"),
  });
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

/**
 * Run this from the Apps Script editor (select runValidationTests_ → Run) after
 * changing the script. It exercises validation only — no rows, no email.
 */
function runValidationTests_() {
  const validOrder = {
    name: "Test Customer",
    phone: "555-0100",
    email: "test@example.com",
    pickupDay: "Sunday",
    paymentMethod: "zelle",
    items: [{ name: "Classic Country", quantity: 2 }],
    message: "No walnuts please",
    source: "test",
  };

  const failures = [];

  function expectValid(label, patch) {
    const input = Object.assign({}, validOrder, patch || {});
    try {
      return normalizeOrder_(input);
    } catch (err) {
      failures.push(label + " should have been accepted, but failed: " + err.message);
      return null;
    }
  }

  function expectRejected(label, patch) {
    try {
      normalizeOrder_(Object.assign({}, validOrder, patch));
      failures.push(label + " should have been rejected, but was accepted");
    } catch (_err) {
      // expected
    }
  }

  const normalized = expectValid("a complete order");
  if (normalized) {
    if (normalized.total !== 24) {
      failures.push("expected total 24 from the price list, got " + normalized.total);
    }
    if (normalized.paymentLabel !== "Zelle") {
      failures.push("expected payment label Zelle, got " + normalized.paymentLabel);
    }
  }

  // A tampered price must not influence the total.
  const tampered = expectValid("an order with a tampered price", {
    items: [{ name: "Classic Country", quantity: 2, unitPrice: 0, lineTotal: 0 }],
  });
  if (tampered && tampered.total !== 24) {
    failures.push("client-supplied price changed the total to " + tampered.total);
  }

  // An item missing from PRICES stays in the order but is flagged, so a menu
  // change cannot silently take the form offline.
  const unpriced = expectValid("an order with an unknown item", {
    items: [{ name: "Mystery Loaf", quantity: 1 }],
  });
  if (unpriced && !unpriced.hasUnpricedItem) {
    failures.push("an unknown item should set hasUnpricedItem");
  }

  expectRejected("a missing name", { name: "" });
  expectRejected("a malformed email", { email: "not-an-email" });
  expectRejected("a pickup day we do not offer", { pickupDay: "Monday" });
  expectRejected("an unknown payment method", { paymentMethod: "bitcoin" });
  expectRejected("an empty order", { items: [] });
  expectRejected("a non-array items field", { items: "Classic Country" });
  expectRejected("a zero quantity", { items: [{ name: "Classic Country", quantity: 0 }] });
  expectRejected("a negative quantity", { items: [{ name: "Classic Country", quantity: -3 }] });
  expectRejected("a quantity above the cap", {
    items: [{ name: "Classic Country", quantity: CONFIG.MAX_ITEM_QUANTITY + 1 }],
  });

  if (failures.length) {
    throw new Error("Validation tests failed:\n- " + failures.join("\n- "));
  }

  console.log("All validation tests passed.");
}
