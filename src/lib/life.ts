export type LifeStats = {
  birthDate: string;
  today: string;
  ageYears: number;
  ageMonths: number;
  ageDays: number;
  daysLived: number;
  weeksLived: number;
  daysUntilBirthday: number;
  birthWeekday: string;
  yearProgress: number;
};

export type LifeWeek = {
  index: number;
  date: string;
  state: "past" | "current" | "future";
};

const DAY_MS = 86_400_000;
const WEEK_MS = DAY_MS * 7;

function utcDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function isValidDate(date: Date, value: string): boolean {
  return Number.isFinite(date.getTime()) && formatDate(date) === value;
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

function anniversary(year: number, birth: Date): Date {
  const month = birth.getUTCMonth();
  const day = Math.min(birth.getUTCDate(), daysInMonth(year, month));
  return new Date(Date.UTC(year, month, day));
}

export function parseBirthDate(value: string, today = new Date()): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = utcDate(value);
  const current = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  if (!isValidDate(date, value) || date > current) return null;
  return date;
}

export function calculateAge(birth: Date, today: Date): { years: number; months: number; days: number } {
  const current = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  let years = current.getUTCFullYear() - birth.getUTCFullYear();
  const birthdayThisYear = anniversary(current.getUTCFullYear(), birth);

  if (birthdayThisYear > current) years -= 1;

  const lastBirthday = anniversary(birth.getUTCFullYear() + years, birth);
  let months = current.getUTCMonth() - lastBirthday.getUTCMonth();
  let days = current.getUTCDate() - lastBirthday.getUTCDate();

  if (days < 0) {
    months -= 1;
    days += daysInMonth(current.getUTCFullYear(), current.getUTCMonth() - 1);
  }

  if (months < 0) months += 12;

  return { years, months, days };
}

export function calculateStats(birth: Date, today = new Date()): LifeStats {
  const current = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const daysLived = Math.floor((current.getTime() - birth.getTime()) / DAY_MS);
  const age = calculateAge(birth, current);

  let nextBirthday = anniversary(current.getUTCFullYear(), birth);
  if (nextBirthday <= current) nextBirthday = anniversary(current.getUTCFullYear() + 1, birth);

  const lastBirthday = anniversary(current.getUTCFullYear(), birth) <= current
    ? anniversary(current.getUTCFullYear(), birth)
    : anniversary(current.getUTCFullYear() - 1, birth);
  const nextYearStart = anniversary(lastBirthday.getUTCFullYear() + 1, birth);
  const yearLength = nextYearStart.getTime() - lastBirthday.getTime();
  const yearProgress = Math.min(1, Math.max(0, (current.getTime() - lastBirthday.getTime()) / yearLength));

  return {
    birthDate: formatDate(birth),
    today: formatDate(current),
    ageYears: age.years,
    ageMonths: age.months,
    ageDays: age.days,
    daysLived,
    weeksLived: Math.floor(daysLived / 7),
    daysUntilBirthday: Math.ceil((nextBirthday.getTime() - current.getTime()) / DAY_MS),
    birthWeekday: birth.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" }),
    yearProgress,
  };
}

export function buildLifeWeeks(birth: Date, today = new Date(), futureYears = 80): LifeWeek[] {
  const current = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const end = anniversary(birth.getUTCFullYear() + futureYears, birth);
  const weeks = Math.ceil((end.getTime() - birth.getTime()) / WEEK_MS);

  return Array.from({ length: weeks }, (_, index) => {
    const date = new Date(birth.getTime() + index * WEEK_MS);
    const dateString = formatDate(date);
    const state = date > current
      ? "future"
      : formatDate(new Date(date.getTime() + WEEK_MS)) > formatDate(current)
        ? "current"
        : "past";
    return { index, date: dateString, state };
  });
}

export function isBirthday(birth: Date, today = new Date()): boolean {
  const current = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  return anniversary(current.getUTCFullYear(), birth).getTime() === current.getTime();
}
