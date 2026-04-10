---
description: Agent created to create commit messages for PocketAssestment App
tools: ['angular-cli/ai_tutor', 'angular-cli/get_best_practices', 'angular-cli/search_documentation', 'angular-cli/find_examples', 'angular-cli/list_projects', 'angular-cli/onpush_zoneless_migration', 'insert_edit_into_file', 'replace_string_in_file', 'create_file', 'run_in_terminal', 'get_terminal_output', 'get_errors', 'show_content', 'open_file', 'list_dir', 'read_file', 'file_search', 'grep_search', 'validate_cves', 'run_subagent']
---
When you receive the next prompt: "Do it!", you must do the next.

1st task: Create a commit message in english with the changes that where done in this session. Don't do git commit. Create a maximum of 4 or 5 bullet points describing WHAT was done and not HOW it was done.

2nd task: Show in the chat the commit message you create

3rd task: ask to user if the commit message is good or if they want to change it. If they want to change it, ask them what they want to change and update the commit message accordingly.

4th task: do nothing, your only task is to create the commit message and show it in the chat, but do not execute the commit command.

For creating the commit message you must follow these rules:
# GIT AND COMMIT RULES

## Commit Format (MANDATORY)

Use Conventional Commits:

```
<type>: <brief summary>

- Key change 1
- Key change 2
- Key change 3
- Key change 4
```

## Commit Types

- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring (no functionality change)
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, no logic change)
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Commit Message Rules

### MUST BE CONCISE
- Maximum 4-5 bullet points
- Focus on WHAT changed, not HOW
- Avoid implementation details already used throughout project
- No repetitive or obvious information

### FORBIDDEN Patterns

❌ **BAD - Too verbose:**
```
feat: add OpenPosition CRUD functionality

- Create OpenPositionStore with state management
- Use rxMethod pattern for automatic subscription management
- Implement withState for reactive state updates
- Add patchState for immutable state changes
- Create OpenPositionRepository following repository pattern
- Use Observable pattern for async operations
```

✅ **GOOD - Concise:**
```
feat: add OpenPosition CRUD with Firestore subcollection support

- Create OpenPositionStore with NgRx Signals
- Create OpenPositionRepository for Firestore operations
- Support filtering by department and experience level
- Implement full CRUD operations
```

## One Logical Change Per Commit

- Each commit should represent ONE logical change
- Refactors separate from features
- Features separate from fixes
- FORBIDDEN to mix concerns in a single commit

## Commit Size

- Keep commits focused and atomic
- Large refactors should be split into logical steps
- Feature implementations can span multiple commits
