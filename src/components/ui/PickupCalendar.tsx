import { useEffect, useMemo, useState } from "react";
import {
  addDaysYmd,
  formatPickupDateLabel,
  parseYmd,
  toYmd,
} from "../../lib/pickupAvailability";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

type PickupCalendarProps = {
  availableDates: readonly string[];
  value: string;
  onChange: (ymd: string) => void;
  disabled?: boolean;
};

function monthKey(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

function startOfCalendar(year: number, month: number): string {
  const first = new Date(year, month - 1, 1);
  const sundayOffset = first.getDay();
  return addDaysYmd(toYmd(year, month, 1), -sundayOffset);
}

export function PickupCalendar({
  availableDates,
  value,
  onChange,
  disabled = false,
}: PickupCalendarProps) {
  const available = useMemo(() => new Set(availableDates), [availableDates]);
  const sorted = useMemo(() => [...availableDates].sort(), [availableDates]);
  const availableMonths = useMemo(() => {
    const keys = new Set<string>();
    for (const date of sorted) {
      const parsed = parseYmd(date);
      if (parsed) keys.add(monthKey(parsed.year, parsed.month));
    }
    return keys;
  }, [sorted]);

  const initialMonth = useMemo(() => {
    const seed = value && parseYmd(value) ? value : sorted[0];
    const parsed = seed ? parseYmd(seed) : null;
    const now = new Date();
    return parsed ?? { year: now.getFullYear(), month: now.getMonth() + 1 };
  }, [sorted, value]);

  const [visible, setVisible] = useState(initialMonth);

  useEffect(() => {
    const seed = value && parseYmd(value) ? value : sorted[0];
    const parsed = seed ? parseYmd(seed) : null;
    if (!parsed) return;
    setVisible((current) => {
      const currentKey = monthKey(current.year, current.month);
      if (availableMonths.has(currentKey)) return current;
      return { year: parsed.year, month: parsed.month };
    });
  }, [availableMonths, sorted, value]);

  const cells = useMemo(() => {
    const start = startOfCalendar(visible.year, visible.month);
    return Array.from({ length: 42 }, (_, index) => addDaysYmd(start, index));
  }, [visible.month, visible.year]);

  const title = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(visible.year, visible.month - 1, 1));

  const shiftMonth = (delta: number) => {
    const date = new Date(visible.year, visible.month - 1 + delta, 1);
    setVisible({ year: date.getFullYear(), month: date.getMonth() + 1 });
  };

  const prevMonth = new Date(visible.year, visible.month - 2, 1);
  const nextMonth = new Date(visible.year, visible.month, 1);
  const canGoPrev = [...availableMonths].some(
    (key) => key <= monthKey(prevMonth.getFullYear(), prevMonth.getMonth() + 1),
  );
  const canGoNext = [...availableMonths].some(
    (key) => key >= monthKey(nextMonth.getFullYear(), nextMonth.getMonth() + 1),
  );

  if (sorted.length === 0) {
    return (
      <p className="rounded-2xl border border-light-lavender bg-white/90 px-4 py-3 font-body text-sm text-warm-gray">
        No pickup dates are open right now. Please text us and we will find a time
        that works.
      </p>
    );
  }

  return (
    <div>
      <div className="rounded-2xl border border-light-lavender bg-white/90 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-light-lavender font-body text-deep-blue transition-colors hover:border-lavender hover:bg-light-lavender/40 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => shiftMonth(-1)}
            disabled={disabled || !canGoPrev}
            aria-label="Previous month"
          >
            ‹
          </button>
          <p className="font-display text-xl font-bold text-deep-blue" aria-live="polite">
            {title}
          </p>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-light-lavender font-body text-deep-blue transition-colors hover:border-lavender hover:bg-light-lavender/40 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => shiftMonth(1)}
            disabled={disabled || !canGoNext}
            aria-label="Next month"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="pb-1 font-body text-[11px] font-bold tracking-wide text-lavender uppercase"
            >
              {day}
            </div>
          ))}
          {cells.map((ymd) => {
            const parsed = parseYmd(ymd);
            const inMonth = parsed?.month === visible.month;
            const isAvailable = available.has(ymd);
            const isSelected = value === ymd;

            return (
              <button
                key={ymd}
                type="button"
                disabled={disabled || !isAvailable}
                onClick={() => onChange(ymd)}
                aria-label={formatPickupDateLabel(ymd)}
                aria-pressed={isSelected}
                className={`flex h-10 items-center justify-center rounded-xl font-body text-sm transition-colors ${
                  !inMonth
                    ? "text-warm-gray/35"
                    : isSelected
                      ? "bg-soft-blue font-bold text-deep-blue"
                      : isAvailable
                        ? "text-deep-blue hover:bg-light-lavender/50"
                        : "text-warm-gray/35 line-through"
                } disabled:cursor-not-allowed`}
              >
                {parsed?.day}
              </button>
            );
          })}
        </div>
      </div>
      {value ? (
        <p className="mt-3 font-body text-sm text-deep-blue">
          Pickup on <strong>{formatPickupDateLabel(value)}</strong>
        </p>
      ) : (
        <p className="mt-3 font-body text-sm text-warm-gray/80">
          Choose a date at least 2 days out. Orders after 12pm Eastern count from
          the next morning.
        </p>
      )}
    </div>
  );
}
