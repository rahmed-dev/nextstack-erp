# Sprint Artifacts Layout

- `sprint-status.yaml` — tracker for all epics/stories.
- `epic-0-core-platform/`
  - `stories/` — platform stories (e.g., shared listing framework, audit engine).
  - `validation/` — validation reports for core platform stories.
- `epic-1-invoice-accounting-core/`
  - `stories/` — story drafts (`ready-for-dev`) for Epic 1.
  - `validation/` — validation reports for Epic 1 stories.
  - `retrospective.md` — optional retro notes/action items for Epic 1.

Add future epics as `epic-N-<slug>/stories` and `validation` under this folder. Keep story paths updated in their metadata and in validation reports. Story location base remains `docs/sprint-artifacts` (stories live in per-epic subfolders).
