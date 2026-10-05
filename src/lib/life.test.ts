import { describe, expect, it } from "vitest";
import { buildLifeWeeks, calculateAge, calculateStats, isBirthday, parseBirthDate } from "./life";

const today = new Date(Date.UTC(2026, 9, 5));

function date(value: string): Date {
  return new Date(`${value}T00:00:00Z`);
}

describe("parseBirthDate", () => {
  it("accepts valid dates", () => {
    expect(parseBirthDate("2007-10-05", today)).not.toBeNull();
  });

  it("rejects invalid calendar dates", () => {
    expect(parseBirthDate("2007-02-30", today)).toBeNull();
  });

  it("rejects future dates", () => {
    expect(parseBirthDate("2026-10-06", today)).toBeNull();
  });
});

describe("calculateAge", () => {
  it("calculates a completed birthday exactly", () => {
    expect(calculateAge(date("2007-10-05"), today)).toEqual({ years: 19, months: 0, days: 0 });
  });

  it("handles dates before the birthday in the current year", () => {
    expect(calculateAge(date("2007-12-20"), today)).toEqual({ years: 18, months: 9, days: 15 });
  });

  it("handles a leap day birth date on a non leap year birthday", () => {
    expect(calculateAge(date("2008-02-29"), date("2025-02-28"))).toEqual({ years: 17, months: 0, days: 0 });
    expect(calculateAge(date("2008-02-29"), date("2025-03-01"))).toEqual({ years: 17, months: 0, days: 1 });
  });
});

describe("calculateStats", () => {
  it("calculates the lifetime summary", () => {
    const stats = calculateStats(date("2007-10-05"), today);
    expect(stats.ageYears).toBe(19);
    expect(stats.ageMonths).toBe(0);
    expect(stats.ageDays).toBe(0);
    expect(stats.daysUntilBirthday).toBe(365);
    expect(stats.birthWeekday).toBe("Friday");
    expect(stats.daysLived).toBeGreaterThan(6900);
  });
});

describe("buildLifeWeeks", () => {
  it("marks the timeline around today", () => {
    const weeks = buildLifeWeeks(date("2007-10-05"), today, 2);
    expect(weeks.length).toBeGreaterThan(100);
    expect(weeks.some((week) => week.state === "past")).toBe(true);
    expect(weeks.some((week) => week.state === "current")).toBe(true);
    expect(weeks.some((week) => week.state === "future")).toBe(true);
  });
});

describe("isBirthday", () => {
  it("recognizes the current birthday", () => {
    expect(isBirthday(date("2007-10-05"), today)).toBe(true);
    expect(isBirthday(date("2007-10-04"), today)).toBe(false);
  });

  it("treats February 28 as the birthday for a February 29 birth in non leap years", () => {
    expect(isBirthday(date("2008-02-29"), date("2025-02-28"))).toBe(true);
    expect(isBirthday(date("2008-02-29"), date("2025-03-01"))).toBe(false);
  });
});
