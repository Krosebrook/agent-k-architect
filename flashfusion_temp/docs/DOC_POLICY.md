# Documentation Governance Policy

## 1. Scope and Authority
This policy governs all files within `docs/`, `ADR/`, `llms.txt`, `llms-full.txt`, and `CHANGELOG.md`.

### Authority Model
- **Human Authority**: Repository Maintainers have final approval on all documentation changes.
- **Documentation Authority Agent (DAA)**: Authorized to propose incremental updates based on verifiable code changes.
- **Fail-Closed**: If the DAA cannot verify provenance (Source/Locator) with High/Medium confidence, it must NOT commit changes. It must flag the section as `Action Required: Human Review`.

## 2. Provenance Requirements
Every new or modified documentation section must include a provenance footer or inline citation.

**Required Fields:**
- **Source**: Where the information comes from (e.g., `code`, `config`, `git`, `standard`).
- **Locator**: Specific file paths, line numbers, or commit SHAs.
- **Confidence**: `HIGH` (direct code read), `MEDIUM` (inference), `LOW` (guess/LLM knowledge).
- **Last Verified**: YYYY-MM-DD.

**Example Footer:**
> _Provenance: Source: code | Locator: src/auth/middleware.ts | Confidence: HIGH | Last Verified: 2024-05-20_

## 3. Incremental Updates & Approvals
- **Standard Rule**: Documentation updates must be incremental. Do NOT rewrite entire files unless strictly necessary for restructuring.
- **Rewrite Override**: Full file rewrites require `DOC_REWRITE_APPROVED=true` in the PR description or agent context.

## 4. Confidence & Validation
- **Thresholds**:
  - `HIGH`: Direct evidence found in codebase.
  - `MEDIUM`: Strong inference based on patterns or naming conventions.
  - `LOW`: General knowledge or assumption.
- **Enforcement**: If >20% of a doc change is `LOW` confidence, the change is rejected automatically (Fail-Closed).

## 5. ADR Governance
- **Architecture Decision Records (ADRs)** are immutable once accepted.
- To change a decision, create a NEW ADR that supersedes the old one.
- **Status**: `Proposed`, `Accepted`, `Rejected`, `Deprecated`, `Superseded`.

## 6. CI/CD Enforcement
- The `docs-authority` workflow validates:
  1. Presence of required files (`SECURITY.md`, `ARCHITECTURE.md`, etc.).
  2. Generation of `llms-full.txt`.
  3. Internal link validity.
- **Emergency Kill-Switch**: Setting `DOC_AUTOMATION_ENABLED=false` (env var) prevents the CI from auto-committing `llms-full.txt`.

## 7. Required Documents
The following files must exist:
- `docs/SECURITY.md`: Threat model and security policies.
- `docs/ARCHITECTURE.md`: High-level design and boundaries.
- `docs/FRAMEWORK.md`: Tech stack and tooling.
- `docs/CHANGELOG.md`: Version history.
- `docs/DOC_POLICY.md`: This policy.
- `llms.txt`: Root entry point.
