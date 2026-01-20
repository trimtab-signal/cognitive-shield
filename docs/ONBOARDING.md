# Onboarding Guide: Cognitive Shield

Welcome! This guide will help new contributors and users get started quickly and confidently.

## Quick Start
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/cognitive-shield.git
   cd cognitive-shield
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```

## Project Structure
- `src/components/` – Modular React UI components
- `src/lib/` – Core logic, protocols, and utilities
- `src/store/` – Zustand state management
- `src/types/` – TypeScript type definitions
- `src/god.config.ts` – Centralized configuration
- `docs/` – Documentation and checkpoints

## Contribution Workflow
- Use feature branches and open pull requests for changes.
- Write clear, descriptive commit messages.
- Add or update documentation and checkpoints for major changes.
- Run `npm run lint` before submitting code.

## Checkpoints & Retrospectives
- Major phases are documented in `docs/CHECKPOINT_*.md` and `RETROSPECTIVE.md`.
- Review these files to understand project evolution and rationale.

## UI/UX Principles
- Accessibility-first: high contrast, keyboard navigation, screen reader support.
- Clear feedback: persistent volume, network/AI status, and error messages.
- No dark patterns, no data harvesting.

## Getting Help
- Read the README and docs for philosophy and technical details.
- Open an issue or discussion for questions or suggestions.

---

_Thank you for joining the Cognitive Shield project!_
