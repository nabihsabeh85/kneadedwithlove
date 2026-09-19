import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  addDaysYmd,
  formatPickupDateLabel,
  isPickupDateAllowed,
  listAvailablePickupDates,
  maxPickupYmd,
  minPickupYmd,
  parseYmd,
} from "./pickupAvailability.ts";

describe("pickup availability", () => {
  it("rejects impossible calendar dates", () => {
    assert.equal(parseYmd("2026-02-29"), null);
    assert.deepEqual(parseYmd("2026-09-24"), { year: 2026, month: 9, day: 24 });
  });

  it("adds days without using the local timezone", () => {
    assert.equal(addDaysYmd("2026-09-30", 1), "2026-10-01");
  });

  it("requires two full days before noon Eastern", () => {
    const mondayMorning = new Date("2026-09-21T11:00:00-04:00");
    assert.equal(minPickupYmd(mondayMorning), "2026-09-23");
  });

  it("starts counting the next day at noon Eastern", () => {
    const mondayNoon = new Date("2026-09-21T12:00:00-04:00");
    assert.equal(minPickupYmd(mondayNoon), "2026-09-24");
  });

  it("opens a four-week window from today", () => {
    const mondayMorning = new Date("2026-09-21T11:00:00-04:00");
    assert.equal(maxPickupYmd(mondayMorning), "2026-10-19");
  });

  it("blocks vacation dates and still offers neighboring days", () => {
    const now = new Date("2026-09-21T11:00:00-04:00");
    const dates = listAvailablePickupDates(now, {
      blocked: ["2026-09-24"],
      opened: [],
    });
    assert.equal(dates.includes("2026-09-23"), true);
    assert.equal(dates.includes("2026-09-24"), false);
    assert.equal(dates.includes("2026-09-25"), true);
  });

  it("lets an Open date override the lead time unless it is also blocked", () => {
    const now = new Date("2026-09-21T11:00:00-04:00");
    const rush = listAvailablePickupDates(now, {
      blocked: [],
      opened: ["2026-09-22"],
    });
    assert.equal(rush.includes("2026-09-22"), true);

    const blockedRush = listAvailablePickupDates(now, {
      blocked: ["2026-09-22"],
      opened: ["2026-09-22"],
    });
    assert.equal(blockedRush.includes("2026-09-22"), false);
  });

  it("does not accept weekday names", () => {
    const now = new Date("2026-09-21T11:00:00-04:00");
    assert.equal(isPickupDateAllowed("Sunday", now), false);
    assert.equal(isPickupDateAllowed("2026-09-23", now), true);
  });

  it("formats the date customers see", () => {
    assert.equal(formatPickupDateLabel("2026-09-24"), "Thursday, September 24, 2026");
  });
});
