# Life in Commits

An interactive lifetime timeline visualized as a GitHub style contribution graph.

## Why it exists

GitHub makes years of development activity easy to see at a glance. Life is also measured in days and weeks, but those units are harder to visualize.

Life in Commits turns a birth date into an interactive timeline so you can explore the time you have lived, the year you are in, and the point where today sits on the larger timeline.

## Features

• Lifetime view using weeks as the primary unit
• Current day marker
• Birthday recognition
• Year explorer
• Lifetime statistics
• Responsive interface
• Accessible timeline controls

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

Run the tests:

```bash
npm test
```

Build for production:

```bash
npm run build
```

## Architecture

The date calculation logic lives in `src/lib/life.ts` and is kept separate from the interface. The timeline is generated from UTC dates so the result does not change because of the user's local timezone.

The application is intentionally client side. There is no account system, database, or external API.

## Scope

The project focuses on accurate date calculations, useful interaction, and a clear visualization of time. Future additions should support that purpose rather than add unrelated application features.

## License

MIT
