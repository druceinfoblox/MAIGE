# MAIGE — Multi-source AI Governance Engine

A GUI prototype demonstrating Infoblox's AI security product concept, built on three pillars:

1. **Agent Visibility** — Discover and monitor AI agents operating across your network using DNS logs and asset inventory
2. **AI Protection** — Detect and block unauthorized AI tool usage, external server connections, and policy violations
3. **Digital Risk Protection** — Surface exposures, shadow AI, and risky behaviors before they become incidents

## Tech Stack

- React + TypeScript + Vite
- shadcn/ui + Tailwind CSS
- React Router + TanStack Query
- Mock data layer (localStorage-backed policy state)

## Development

```bash
npm install
npm run dev
```

## Project Structure

```
src/
  views/        # Page-level views (Dashboard, Agents, Tools, Users, Exposures, Policy)
  components/   # Shared UI components
  data/         # Mock data and policy state hooks
  pages/        # Router pages
```
