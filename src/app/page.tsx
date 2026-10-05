"use client";

import { FormEvent, useMemo, useState } from "react";
import { buildLifeWeeks, calculateStats, isBirthday, parseBirthDate } from "@/lib/life";
import "./globals.css";

const DEFAULT_TODAY = new Date();

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function Home() {
  const [birthDate, setBirthDate] = useState("");
  const [submittedDate, setSubmittedDate] = useState("");
  const [error, setError] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const birth = submittedDate ? parseBirthDate(submittedDate, DEFAULT_TODAY) : null;
  const stats = birth ? calculateStats(birth, DEFAULT_TODAY) : null;
  const weeks = useMemo(() => birth ? buildLifeWeeks(birth, DEFAULT_TODAY, 90) : [], [birth]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = parseBirthDate(birthDate, DEFAULT_TODAY);
    if (!parsed) {
      setError("Enter a valid date of birth that is not in the future.");
      return;
    }
    setError("");
    setSubmittedDate(birthDate);
    setSelectedYear(null);
  }

  const birthday = birth ? isBirthday(birth, DEFAULT_TODAY) : false;
  const currentYear = birth ? DEFAULT_TODAY.getUTCFullYear() - birth.getUTCFullYear() : 0;
  const displayedYear = selectedYear ?? currentYear;
  const yearWeeks = weeks.filter((week) => {
    const date = new Date(`${week.date}T00:00:00Z`);
    return date.getUTCFullYear() - (birth?.getUTCFullYear() ?? 0) === displayedYear;
  });

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">LIFE IN COMMITS</p>
        <h1>See your lifetime at a glance.</h1>
        <p className="intro">
          A lifetime is made of days and weeks. This turns those units into an interactive timeline you can explore.
        </p>

        <form className="date-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="birth-date">Date of birth</label>
          <div className="form-row">
            <input
              id="birth-date"
              type="date"
              value={birthDate}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(event) => setBirthDate(event.target.value)}
            />
            <button type="submit">Explore my timeline</button>
          </div>
          {error && <p className="error" role="alert">{error}</p>}
        </form>
      </section>

      {stats && birth && (
        <section className="dashboard" aria-live="polite">
          <div className="summary-card">
            <div>
              <p className="eyebrow">{birthday ? "BIRTHDAY" : "TODAY"}</p>
              <h2>{stats.ageYears} years</h2>
              <p className="muted">
                {stats.ageMonths} months and {stats.ageDays} days into your current age.
              </p>
            </div>
            <div className="birthday-marker" aria-label={birthday ? "Today is your birthday" : "Today marker"}>
              <span className="marker-dot" />
              <span>{birthday ? "Your next year starts here." : "This is where you are."}</span>
            </div>
          </div>

          <div className="stats-grid">
            <Stat label="Days lived" value={formatNumber(stats.daysLived)} />
            <Stat label="Weeks lived" value={formatNumber(stats.weeksLived)} />
            <Stat label="Days until birthday" value={formatNumber(stats.daysUntilBirthday)} />
            <Stat label="Born on" value={stats.birthWeekday} />
          </div>

          <div className="timeline-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">LIFETIME</p>
                <h2>Weeks lived</h2>
              </div>
              <p className="muted">One square represents one week.</p>
            </div>

            <div className="life-grid" aria-label="Lifetime week timeline">
              {weeks.map((week) => (
                <button
                  key={week.index}
                  className={`life-cell ${week.state}`}
                  title={`${week.date} · ${week.state}`}
                  aria-label={`Week beginning ${week.date}, ${week.state}`}
                  type="button"
                />
              ))}
            </div>

            <div className="legend">
              <span><i className="legend-cell past" /> Lived</span>
              <span><i className="legend-cell current" /> Current</span>
              <span><i className="legend-cell future" /> Future</span>
            </div>
          </div>

          <div className="year-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">YEAR EXPLORER</p>
                <h2>Age {displayedYear}</h2>
              </div>
              <p className="muted">Explore one year in more detail.</p>
            </div>
            <div className="year-picker" role="list" aria-label="Choose an age">
              {Array.from({ length: Math.min(currentYear + 1, 91) }, (_, age) => (
                <button
                  key={age}
                  type="button"
                  className={age === displayedYear ? "selected" : ""}
                  onClick={() => setSelectedYear(age)}
                >
                  {age}
                </button>
              ))}
            </div>
            <div className="year-grid" aria-label={`Weeks in age ${displayedYear}`}>
              {yearWeeks.map((week) => (
                <button
                  key={week.index}
                  type="button"
                  className={`life-cell ${week.state}`}
                  title={week.date}
                  aria-label={`Week beginning ${week.date}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {!stats && (
        <section className="concept">
          <div>
            <p className="eyebrow">THE IDEA</p>
            <h2>A different way to see time.</h2>
          </div>
          <p>
            GitHub turns years of development activity into a grid you can understand in seconds. Life is also a sequence of days and weeks. Life in Commits uses the same visual idea to make that timeline visible.
          </p>
        </section>
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
