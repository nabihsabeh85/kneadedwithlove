/**
 * Pickup-date rules shared by the order form.
 * Keep in sync with CONFIG in scripts/google-apps/OrderIntake.gs.
 */
export const PICKUP_TIMEZONE = "America/New_York";
export const MIN_LEAD_DAYS = 2;
/** Orders at or after this hour (bakery timezone) do not count the current day. */
export const CUTOFF_HOUR = 12;
export const BOOKING_HORIZON_DAYS = 28;

export const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export type AvailabilityRules = {
  blocked: readonly string[];
  opened: readonly string[];
};

export type ZonedDateParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  ymd: string;
};

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

export function toYmd(year: number, month: number, day: number): string {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

export function parseYmd(ymd: string): { year: number; month: number; day: number } | null {
  if (!ISO_DATE.test(ymd)) return null;
  const year = Number(ymd.slice(0, 4));
  const month = Number(ymd.slice(5, 7));
  const day = Number(ymd.slice(8, 10));
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (
    probe.getUTCFullYear() !== year ||
    probe.getUTCMonth() !== month - 1 ||
    probe.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day };
}

export function addDaysYmd(ymd: string, days: number): string {
  const parsed = parseYmd(ymd);
  if (!parsed) {
    throw new Error(`Invalid date: ${ymd}`);
  }
  const date = new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day));
  date.setUTCDate(date.getUTCDate() + days);
  return toYmd(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
}

export function zonedDateParts(now: Date, timeZone: string = PICKUP_TIMEZONE): ZonedDateParts {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(now).map((part) => [part.type, part.value]),
  );
  const year = Number(parts.year);
  const month = Number(parts.month);
  const day = Number(parts.day);
  const hour = Number(parts.hour);
  return { year, month, day, hour, ymd: toYmd(year, month, day) };
}

export function minPickupYmd(now: Date, timeZone: string = PICKUP_TIMEZONE): string {
  const parts = zonedDateParts(now, timeZone);
  const start = parts.hour >= CUTOFF_HOUR ? addDaysYmd(parts.ymd, 1) : parts.ymd;
  return addDaysYmd(start, MIN_LEAD_DAYS);
}

export function maxPickupYmd(now: Date, timeZone: string = PICKUP_TIMEZONE): string {
  return addDaysYmd(zonedDateParts(now, timeZone).ymd, BOOKING_HORIZON_DAYS);
}

export function eachYmd(start: string, end: string): string[] {
  if (end < start) return [];
  const dates: string[] = [];
  let cursor = start;
  while (cursor <= end) {
    dates.push(cursor);
    cursor = addDaysYmd(cursor, 1);
  }
  return dates;
}

/**
 * Default window is every calendar day from the 2-day / noon cutoff through
 * 4 weeks out. Blocked dates are removed. Open dates are added even if they
 * fall outside that window, as long as they are not in the past and not blocked.
 */
export function listAvailablePickupDates(
  now: Date,
  rules: AvailabilityRules = { blocked: [], opened: [] },
  timeZone: string = PICKUP_TIMEZONE,
): string[] {
  const today = zonedDateParts(now, timeZone).ymd;
  const blocked = new Set(rules.blocked.filter((date) => ISO_DATE.test(date)));
  const opened = new Set(rules.opened.filter((date) => ISO_DATE.test(date)));
  const available = new Set(
    eachYmd(minPickupYmd(now, timeZone), maxPickupYmd(now, timeZone)).filter(
      (date) => !blocked.has(date),
    ),
  );

  for (const date of opened) {
    if (!blocked.has(date) && date >= today) {
      available.add(date);
    }
  }

  return [...available].sort();
}

export function isPickupDateAllowed(
  ymd: string,
  now: Date,
  rules: AvailabilityRules = { blocked: [], opened: [] },
  timeZone: string = PICKUP_TIMEZONE,
): boolean {
  return listAvailablePickupDates(now, rules, timeZone).includes(ymd);
}

export function formatPickupDateLabel(ymd: string): string {
  const parsed = parseYmd(ymd);
  if (!parsed) return ymd;
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(parsed.year, parsed.month - 1, parsed.day));
}
