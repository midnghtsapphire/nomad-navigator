# Contributing to Nomad Navigator

Thanks for helping improve Nomad Navigator. Keep changes small, tested, and revenue-relevant (tax clarity DX, security, reliability).

## Branching

1. Branch from `main`: `feature/…`, `fix/…`, `chore/…`, or `docs/…`.
2. Open a PR into `main`. Do not push directly to `main`.
3. Keep the PR focused — one concern per PR.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` new user-facing capability
- `fix:` bug fix
- `docs:` documentation only
- `chore:` tooling / deps / maintenance
- `test:` tests only
- `ci:` workflow changes
- `refactor:` no behavior change

## Local checklist before PR

```bash
npm install
npm test
npm run lint
npm run typecheck
npm run build
```

All of the above should pass.

## PR expectations

- Description explains **why**, not only what.
- Link the source Work Request when applicable (`Closes midnghtsapphire/revvel-standards#N`).
- No secrets in the diff (`.env` is gitignored; use `.env.example`).
- Prefer pure helpers under `src/lib/` with Vitest coverage for tax/residency math.
- Draft PRs are fine for WIP; mark **Ready for review** when the full review jury should run (OpenRouter AI review skips drafts by default).

## Security

- Browser code may use Supabase **anon** keys only.
- Do not log PII (emails, full travel histories) to third-party sinks without review.
- Tax figures are educational estimates — keep disclaimer language intact in UI/docs.
