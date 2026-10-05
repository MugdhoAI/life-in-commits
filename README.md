# Life in Commits

An interactive lifetime timeline visualized as a GitHub style contribution graph.

## Why it exists

GitHub makes years of development activity easy to see at a glance. Life is also measured in days and weeks, but those units are harder to visualize.

Life in Commits turns a birth date into an interactive timeline so you can explore the time you have lived, the year you are in, and the point where today sits on the larger timeline.

## Features

• Lifetime view using weeks as the primary unit
• Detailed view for individual ages
• Current day and birthday markers
• Age, days lived, weeks lived, and birthday statistics
• Calendar aware date calculations
• Leap year handling
• Responsive interface
• Keyboard accessible timeline controls

## Tech stack

Next.js
TypeScript
React
CSS
Vitest

## Development

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Run the test suite:

```bash
npm test
```

Create a production build:

```bash
npm run build
```

## Architecture

The date and timeline calculations live separately from the interface in `src/lib/life.ts`. This keeps the core logic independently testable and prevents date arithmetic from being spread across the UI.

The application uses UTC calendar dates for deterministic calculations across time zones.

## Scope

The project intentionally avoids accounts, databases, backend services, and unrelated features. The focus is accurate date calculations, useful interaction, and a clear visualization of time.

## License

MIT
