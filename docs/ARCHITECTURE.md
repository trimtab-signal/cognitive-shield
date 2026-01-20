# Cognitive Shield Architecture

## Overview
Cognitive Shield is structured for modularity, clarity, and extensibility. The architecture separates UI, core logic, state management, and configuration, supporting both rapid iteration and long-term maintainability.

## Directory Structure
```
cognitive-shield/
├── src/
│   ├── components/      # React UI components (modular, focused)
│   ├── lib/             # Core logic, protocols, utilities
│   ├── store/           # Zustand state management
│   ├── types/           # TypeScript type definitions
│   └── god.config.ts    # Centralized configuration
├── public/              # Static assets
├── docs/                # Documentation (architecture, protocols, etc.)
├── package.json         # Project manifest
└── README.md            # Project overview and onboarding
```

## Module Relationships
- **UI Components** interact with state via Zustand stores and invoke logic from `lib/`.
- **Core Logic** in `lib/` handles message processing, AI, math, and hardware protocols.
- **Configuration** in `god.config.ts` is imported wherever needed for consistency.
- **Documentation** in `docs/` and markdown files supports onboarding and maintenance.

## Design Principles
- Privacy-first, accessibility-first, and modular by design.
- No dark patterns, no data harvesting, and local-first storage.
- Extensible via modules and clear separation of concerns.

---

For more, see README.md and individual module docs.
