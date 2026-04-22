# Agent Instruction Library

## Project: GzGTracker

Cashback deal tracker for managing "Geld-zurück" (money-back) submissions.

### Technology Stack

**Frontend:**
- Vue 3 (Composition API) + TypeScript
- Vue Router (navigation)
- Pinia (state management)
- Vue I18n (multi-language)

**UI:**
- Tailwind CSS 4.x (Vite plugin)
- Tailwind Forms plugin

**Storage:**
- LocalForage (offline-first local storage)

**PWA:**
- Vite PWA plugin + Workbox
- Service workers, offline support

**Build/Dev:**
- Vite 7
- Vitest + Happy-DOM/JSDOM
- Vue DevTools plugin

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
- Follow existing code style and conventions

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
- Answer questions directly
- Avoid unnecessary explanations unless asked
- Use markdown for formatting
- Reference code locations as `file_path:line_number`

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
