# Documentation Governance Policy

## 1. Authority Model
This repository utilizes a **Documentation Authority** model.
- **Human Engineers** retain ultimate creative and architectural authority.
- **Documentation Agents** are permitted to maintain state, index files, and propose increments.
- **CI Enforcement**: The `llms-full.txt` context file is generated deterministically. Manual edits to `llms-full.txt` will be overwritten.

## 2. Required Documentation
The following files must exist and remain up-to-date:
- `docs/DOC_POLICY.md` (This file)
- `docs/SECURITY.md` (Threat models, boundaries, auth patterns)
- `docs/ARCHITECTURE.md` (System design, modules, data flow)
- `docs/FRAMEWORK.md` (Stack decisions, tooling)
- `docs/CHANGELOG.md` (Version history)

## 3. Provenance Rules
All documentation updates must include a provenance footer to ensure traceability.

**Format:**
```markdown
---
Source: [file_path | config | git_sha]
Locator: [specific_function | line_range]
Confidence: [HIGH | MEDIUM | LOW]
Last Verified: YYYY-MM-DD
```

- **HIGH**: Directly verified against code or config.
- **MEDIUM**: inferred from patterns or comments.
- **LOW**: Speculative or placeholder (Must include `Status: UNKNOWN`).

## 4. Incremental Updates
- Do NOT rewrite entire files unless `DOC_REWRITE_APPROVED=true` is set in the prompt context.
- Prefer appending sections or updating specific lines over full replacement.

## 5. Kill-Switch
To disable automated documentation commits:
- Set `DOC_AUTOMATION_ENABLED=false` in GitHub Actions secrets or environment.

---
Source: Policy Definition
Confidence: HIGH
Last Verified: 2024-05-23
