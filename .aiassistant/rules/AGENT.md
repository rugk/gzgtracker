---
apply: always
---

# Agent Instruction Library

## Project: GzGTracker

Cashback deal tracker for managing "Geld-zurück" (money-back) submissions.

### Requirements
Non-functional Requirements:
- properly localized into German (proper i18n/l10s)
- default language is English though
- should be cross-plattform/work across devices and be syncronized
- hosting made easy! Best have a static website at the end on GitHub Pages or so?
- security by design and privacy by design, as potentially private data is processed
- expandable, more features can later be thought of.
- maybe offline first (https://offlinefirst.org/) aka save everything in local storage(?) / PWA Progressive Web Application
- in the end, usable by the public/hostable
- modern web browsers e.g. can be supported is more than enough, no backward-compatibility/old browser support is needed
- generally, also use modern & clean code
- an Android app would be nice, but is not needed for the first step/could be later useful though
- should be responsively designed, mobile-first

Functional requirements:
- One person/people can have multiple IBANs.
- An IBAN belongs to some bank.
- A company offers some GzG deal.
- One IBAN could be owned by multiple people (shared bank accounts etc.)
- people often but not always need to provide stuff like email (99% of the cases, you may want to use temporary emails for each deal or at least company), adress, sometime sphone number (sometimes even verified)
- There exist many gzg deals, they should be trackable with start date/end date etc. (end dates often are also renewed/new conditions are applied); they often re-appear in similar fashion (so cloning would be useful)
- they have different conditions and participation counts ("Teilnahmezahl") for entering stuff like "1000per week at 9 o'clock monday" or so, that may be enterable, but can differ quite much e.g. "max 3000, but each week a random weekday gets between 200-1000 partitipation counts at 9-12" etc. etc.
- The community offers a publicly maintained GzG deal Google Docs table in https://docs.google.com/spreadsheets/d/1wcqckNai9SyRbQLt-pj6FHzGM7sypoET9glyAE05u2E/edit#gid=1921596076 (see also their columns) - this could be used as a source for deals.
- partial cashbacks for a gzg deal are possible (like buy two, pay one; or just get some money back etc.)
- proprietary platforms like Scondoo, marktguru, couponplatz and ShopBuddies provide their own cashback (gzg) deals or even coupons (like couponplatz) for offering.

### Technology Stack

* generally use modern technologies, no backwards-compatibility needed!

**Frontend:**
- [Vue 3](https://vuejs.org/) + TypeScript (Composition API, `<script setup>`)
- [Vue Router](https://router.vuejs.org/) (hash-based for static hosting)
- [Pinia](https://pinia.vuejs.org/) (state management)
- [Vue I18n](https://vue-i18n.intlify.dev/) (i18n/l10n)

**UI:**

- Pico CSS

**Storage:**
- LocalForage (offline-first local storage)

**PWA:**
- Vite PWA plugin + Workbox
- Service workers, offline support

**Build/Dev:**
- Vite 7
- Vitest + Happy-DOM
- vue-tsc for type checking

### Architecture

**Stores:** deals, submissions, people, ibans, settings

**Views:** Dashboard, Deals, Submissions, People, IBANs, Settings

**Key Features:** Offline-first PWA, theme support, i18n, local storage persistence

## Core Principles

- **Be Concise**: Provide direct, actionable responses without unnecessary preamble
- **Be Accurate**: Prioritize technical correctness over assumptions
- **Be Proactive**: Take initiative on tasks when asked, but don't surprise users with unexpected actions

## Code Operations

### Reading Code
- Use Read tool for viewing file contents
- Use Grep for searching patterns across files
- Use Glob for finding files by pattern
- Check git status before making changes

### Writing Code
- Always read files before editing them
- Prefer Edit over Write for existing files
- Use Write only for new files
- Include proper error handling
- Clean code! Write clean new code and possibly do refactorings on existing code if needed.

### Refactoring
- Understand the full context before refactoring
- Run tests after changes
- Update related documentation
- Preserve existing functionality

## Task Management

### Planning
- Use TodoWrite for complex multi-step tasks
- Break down large tasks into smaller steps
- Mark todos as in_progress before starting
- Mark todos as completed immediately after finishing

### Execution
1. Understand the requirements
2. Research existing code
3. Plan the implementation
4. Execute step by step
5. Test and verify
6. Clean up if needed

## Communication

### With Users
- be critical and correct the user if the architecture or way is wrong
- if in doubt, ask the user
- Avoid unnecessary explanations unless asked
- Use markdown for formatting

### Progress Updates
- Update todo status in real-time
- Report errors and blockers immediately
- Confirm task completion briefly

## Best Practices

### Before Making Changes
- [ ] Read relevant files
- [ ] Understand the codebase structure
- [ ] Check for existing patterns
- [ ] Plan the approach

### After Making Changes
- [ ] Verify the changes work
- [ ] Run tests if available
- [ ] Check for side effects
- [ ] Update related code/docs if needed

## Common Commands

### Git Operations
```bash
git status                    # Check repository status
git diff                      # View changes
git add <files>              # Stage files
git commit -m "message"      # Commit changes
```

### Build & Test
```bash
npm install                  # Install dependencies
npm run build               # Build project
npm test                    # Run tests
npm run dev                 # Start dev server
```

### File Operations
- Use Read tool (not cat)
- Use Edit tool (not sed/awk)
- Use Write tool (not echo >)
- Use Grep tool (not grep command)

## Error Handling

1. **Read error messages carefully**
2. **Identify root cause**
3. **Research solution if needed**
4. **Apply fix**
5. **Verify resolution**

## Security Guidelines

- Only assist with defensive security tasks
- Refuse malicious code requests
- Don't help with credential harvesting
- Allow security analysis and defensive tools

## When Stuck

1. Search for similar patterns in codebase
2. Check documentation
3. Use WebFetch for external docs
4. Ask user for clarification if needed
