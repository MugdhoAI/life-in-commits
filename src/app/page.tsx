"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { buildLifeWeeks, calculateAge, calculateStats, isBirthday, parseBirthDate } from "@/lib/life";

const REFERENCE_YEARS = 90;

type Theme = "light" | "dark";

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function formatDateLong(value: string): string {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function nextBirthdayDate(birth: Date, today: Date): Date {
  let year = today.getUTCFullYear();
  const month = birth.getUTCMonth();
  const day = Math.min(birth.getUTCDate(), new Date(Date.UTC(year, month + 1, 0)).getUTCDate());
  let next = new Date(Date.UTC(year, month, day));
  if (next <= today) {
    year += 1;
    const adjustedDay = Math.min(birth.getUTCDate(), new Date(Date.UTC(year, month + 1, 0)).getUTCDate());
    next = new Date(Date.UTC(year, month, adjustedDay));
  }
  return next;
}

export default function Home() {
  const [birthDate, setBirthDate] = useState("");
  const [submittedDate, setSubmittedDate] = useState("");
  const [error, setError] = useState("");
  const [theme, setTheme] = useState<Theme>("light");

  const today = useMemo(() => new Date(), []);
  const birth = submittedDate ? parseBirthDate(submittedDate, today) : null;
  const stats = birth ? calculateStats(birth, today) : null;
  const weeks = useMemo(
    () => (birth ? buildLifeWeeks(birth, today, REFERENCE_YEARS) : []),
    [birth, today],
  );

  useEffect(() => {
    const saved = window.localStorage.getItem("life-in-commits-theme");
    if (saved === "dark" || saved === "light") setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("life-in-commits-theme", theme);
  }, [theme]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = parseBirthDate(birthDate, today);
    if (!parsed) {
      setError("Enter a valid date of birth that is not in the future.");
      return;
    }
    setError("");
    setSubmittedDate(birthDate);
  }

  const birthday = birth ? isBirthday(birth, today) : false;
  const currentAge = stats?.ageYears ?? 0;

  const yearGroups = useMemo(() => {
    if (!birth) return [] as typeof weeks[];
    const groups = Array.from({ length: REFERENCE_YEARS }, () => [] as typeof weeks);
    for (const week of weeks) {
      const age = calculateAge(birth, new Date(`${week.date}T00:00:00Z`)).years;
      if (age >= 0 && age < REFERENCE_YEARS) groups[age].push(week);
    }
    return groups;
  }, [birth, weeks]);

  const currentYearWeeks = yearGroups[currentAge] ?? [];
  const livedWeeks = weeks.filter((week) => week.state === "past").length;
  const futureWeeks = weeks.filter((week) => week.state === "future").length;
  const referenceWeeks = weeks.length;
  const referenceProgress = referenceWeeks ? livedWeeks / referenceWeeks : 0;

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">✦</span>
            <div>
              <strong>Life in Commits</strong>
              <span>Your life. Visualized.</span>
            </div>
          </div>

          <form className="sidebar-form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="birth-date">Your date of birth</label>
            <input
              id="birth-date"
              type="date"
              value={birthDate}
              max={today.toISOString().slice(0, 10)}
              onChange={(event) => setBirthDate(event.target.value)}
            />
            <button className="primary-button" type="submit">Explore my timeline</button>
            {error && <p className="error" role="alert">{error}</p>}
          </form>

          {stats && birth && (
            <div className="age-panel">
              <span className="panel-label">CURRENT AGE</span>
              <strong>{stats.ageYears} years</strong>
              <p>Born on {formatDateLong(stats.birthDate)}</p>
              <div className="panel-divider" />
              <div className="sidebar-stat"><span>Days lived</span><strong>{formatNumber(stats.daysLived)}</strong></div>
              <div className="sidebar-stat"><span>Weeks lived</span><strong>{formatNumber(stats.weeksLived)}</strong></div>
              <div className="sidebar-stat"><span>Days until birthday</span><strong>{formatNumber(stats.daysUntilBirthday)}</strong></div>
            </div>
          )}
        </div>

        <div className="sidebar-footer">
          <button
            className="theme-toggle"
            type="button"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <span aria-hidden="true">{theme === "light" ? "◐" : "○"}</span>
            {theme === "light" ? "Dark mode" : "Light mode"}
          </button>
          <p>“Not just the years in your life, but the life in your years.”</p>
        </div>
      </aside>

      <section className="content">
        <header className="content-header">
          <div>
            <p className="eyebrow">YOUR LIFETIME</p>
            <h1>See your life in weeks.</h1>
            <p className="intro">A visual journey through your life, one week at a time.</p>
          </div>
          <div className="reference-badge">
            <strong>{REFERENCE_YEARS} year view</strong>
            <span>{referenceWeeks ? `${formatNumber(referenceWeeks)} weeks in this reference` : "Choose a date to begin"}</span>
          </div>
        </header>

        {!stats || !birth ? (
          <section className="empty-state">
            <p className="eyebrow">START HERE</p>
            <h2>Put a date on the timeline.</h2>
            <p>Enter your date of birth to see your life divided into years and weeks.</p>
          </section>
        ) : (
          <>
            <section className="summary-strip">
              <SummaryItem label="Past" value={`${formatNumber(livedWeeks)} weeks`} percent={formatPercent(livedWeeks / referenceWeeks)} tone="past" />
              <SummaryItem label="Current year" value={`${formatNumber(currentYearWeeks.length)} weeks`} percent={formatPercent(currentYearWeeks.length / referenceWeeks)} tone="current" />
              <SummaryItem label="Future" value={`${formatNumber(futureWeeks)} weeks`} percent={formatPercent(futureWeeks / referenceWeeks)} tone="future" />
            </section>

            <section className="timeline-section">
              <div className="section-topline">
                <div>
                  <p className="eyebrow">LIFETIME VIEW</p>
                  <h2>Every year, one block</h2>
                </div>
                <div className="today-note">
                  <span className="current-dot" />
                  {birthday ? "Today is your birthday." : `You are ${stats.ageYears} years, ${stats.ageMonths} months, and ${stats.ageDays} days old.`}
                </div>
              </div>

              <div className="year-grid-large">
                {yearGroups.map((yearWeeks, age) => {
                  const calendarYear = birth.getUTCFullYear() + age;
                  const isCurrent = age === currentAge;
                  return (
                    <article className={`year-block ${isCurrent ? "is-current" : ""}`} key={age}>
                      <div className="year-heading">
                        <strong>{calendarYear}</strong>
                        <span>Age {age}</span>
                      </div>
                      <div className="week-grid" aria-label={`Age ${age}, year ${calendarYear}`}>
                        {yearWeeks.map((week) => (
                          <button
                            key={week.index}
                            type="button"
                            className={`week-cell ${week.state}`}
                            title={`${week.date} · ${week.state}`}
                            aria-label={`Week beginning ${week.date}, ${week.state}`}
                          />
                        ))}
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="legend">
                <span><i className="legend-cell past" /> Past</span>
                <span><i className="legend-cell current" /> Current</span>
                <span><i className="legend-cell future" /> Future</span>
              </div>
            </section>

            <section className="bottom-grid">
              <InfoCard title="Next birthday" value={formatDateLong(nextBirthdayDate(birth, today).toISOString().slice(0, 10))} detail={`${formatNumber(stats.daysUntilBirthday)} days from today`} />
              <InfoCard title="Life so far" value={formatPercent(referenceProgress)} detail={`${formatNumber(livedWeeks)} of ${formatNumber(referenceWeeks)} weeks lived`} progress={referenceProgress} />
              <InfoCard title="A simple reminder" value={`${formatNumber(stats.weeksLived)} weeks`} detail="Each square is one week. The reference is a visualization, not a prediction of lifespan." />
            </section>
          </>
        )}
      </section>
    </main>
  );
}

function SummaryItem({ label, value, percent, tone }: { label: string; value: string; percent: string; tone: "past" | "current" | "future" }) {
  return (
    <div className="summary-item">
      <span className={`summary-icon ${tone}`} />
      <div>
        <strong>{label}</strong>
        <span>{value}</span>
        <small>{percent}</small>
      </div>
    </div>
  );
}

function InfoCard({ title, value, detail, progress }: { title: string; value: string; detail: string; progress?: number }) {
  return (
    <article className="info-card">
      <p className="eyebrow">{title}</p>
      <strong>{value}</strong>
      {progress !== undefined && <div className="progress-track"><span style={{ width: `${Math.min(progress * 100, 100)}%` }} /></div>}
      <p>{detail}</p>
    </article>
  );
}
