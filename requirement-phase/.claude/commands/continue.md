# Command: /continue

Resume documentation work from the last session.

## Purpose

Pick up where the previous session left off by reading progress tracking and allowing user to continue seamlessly.

## When to Use

- User returns after pausing work
- User says "continue", "resume", "keep going", "where were we"
- User explicitly types `/continue`

## Prerequisites

- Project must be initialized (PROGRESS.md and project-overview.md must exist)

## Execution Steps

### Step 1: Load Current State

Read the following files:
1. `PROGRESS.md` - Get current phase, completed sections, in-progress sections
2. `project-overview.md` - See overall scope and checklist

### Step 2: Display Current Progress

Present a clear summary:

```markdown
Welcome back! Here's where we left off:

## Current Progress

**Project:** [Project Name]
**Last Session:** [Date from PROGRESS.md]

### ✅ Completed ([X] sections)
- [List completed items from PROGRESS.md]

### 🔄 In Progress ([X] sections)
- [Item 1] (50% - missing: [details])
- [Item 2] (30% - missing: [details])

### ⏳ Pending ([X] sections)
[Count of remaining unchecked items in overview checklist]

**Current Phase:** [Phase from PROGRESS.md]
```

### Step 3: Offer Options

Ask the user how they want to proceed:

```
Would you like to:

1. Continue with [in-progress item]
2. Start [next pending priority item]
3. Review/update something already completed
4. Jump to a specific section
5. See detailed status with /status

What would you prefer?
```

### Step 4: Execute User Choice

Based on user's selection:

**Option 1 - Continue in-progress:**
- Load the relevant documentation file
- Show what's already documented
- Ask for the missing pieces noted in PROGRESS.md
- Update file and PROGRESS.md when section is complete

**Option 2 - Start next pending:**
- Identify next priority item from PROGRESS.md pending list
- Begin requirement gathering for that item
- Use appropriate question patterns from `references/gathering-strategies.md`
- Create new documentation file(s) as needed

**Option 3 - Review/update completed:**
- Ask "Which section would you like to review?"
- Load that section with `/preview [section]`
- If they want to modify, redirect to `/update [section]`

**Option 4 - Jump to specific:**
- Ask "Which section would you like to work on?"
- Begin gathering requirements for that section
- Update PROGRESS.md to reflect new current work

**Option 5 - Detailed status:**
- Execute `/status` command
- Then ask what they want to do next

### Step 5: Update Session Log

Append to PROGRESS.md:

```markdown
### Session [N] - [Current Date and Time]
- Resumed work
- [What was accomplished this session]
```

### Step 6: Continue Working

Proceed with the chosen task, following normal documentation workflows.

## Success Criteria

- ✅ PROGRESS.md loaded successfully
- ✅ Current state clearly communicated to user
- ✅ User given clear options
- ✅ Selected work path initiated
- ✅ Session log updated

## Edge Cases

### No In-Progress Items

If nothing is marked as in-progress:

```
Welcome back! 

✅ Completed: [X] sections
⏳ Pending: [Y] sections

You left off after completing [last completed item]. 

Next suggested priority: [next item from plan]

Would you like to:
1. Start [next priority item]
2. Review completed work
3. Jump to a specific section
```

### Everything Complete

If all checklist items are documented:

```
Welcome back!

Great news - all your requirements sections are documented! 

✅ Total sections completed: [X]

Would you like to:
1. Review any section
2. Add new requirements to the scope
3. Run validation to check for issues
4. Finalize and prepare for handoff
```

### Project Not Found

If PROGRESS.md doesn't exist:

```
I don't see an existing project in this directory. 

Would you like to:
1. Start a new project with /init
2. Navigate to a different directory
```

## Progress Update Guidelines

When updating PROGRESS.md during continuation:

1. **Move completed items** from "In Progress 🔄" to "Completed ✓"
2. **Update percentages** for in-progress items
3. **Note missing details** explicitly: "missing: content for sections 2-3"
4. **Remove from pending** when starting new section
5. **Update current phase** if phase changes
6. **Log session activity** with timestamps

## Continuity Best Practices

- Reference specific details from previous sessions to show continuity
- If user seems lost, offer `/status` for full overview
- Acknowledge progress made: "You've completed 8 of 15 planned sections - great progress!"
- Keep momentum: transition smoothly into next task
- Don't re-ask questions that were already answered
- Load previous context before asking new questions

## Notes

- This is one of the most frequently used commands
- Good session resumption creates excellent user experience
- Always read PROGRESS.md first - it's the source of truth
- Be specific about what's missing in in-progress items
- Make it easy for user to pick up where they left off
