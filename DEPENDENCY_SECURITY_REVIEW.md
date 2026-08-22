# Dependency security review

Review date: 22 August 2026

Baseline: `main` at `b9b28a33a62f5205f55e1d3c17b9bbdaddc2a168`

## Executive summary

`npm audit --json` reports 10 vulnerable package nodes: 2 low, 7 moderate,
and 1 high. These nodes are backed by eight unique GitHub Security
Advisories. A production-only audit (`npm audit --omit=dev --json`) reports
eight nodes: 2 low and 6 moderate. The high-severity Vite node and its esbuild
dependency are development/build tooling and are not included in the deployed
browser bundle.

No verified non-breaking update resolves an advisory while preserving the
required major versions. Consequently, this review intentionally makes no
changes to `package.json` or `package-lock.json`.

## Reported vulnerable package nodes

| Package node | Severity | Advisory / CVE | Complete dependency path | Runtime classification | Compatible fix? |
| --- | --- | --- | --- | --- | --- |
| `clean-css@3.4.28` | Low | [GHSA-wxhq-pm8v-cw75](https://github.com/advisories/GHSA-wxhq-pm8v-cw75); no CVE | project → `quill-emoji@0.2.0` → `emoji-data-css@1.0.1` → `clean-css@3.4.28` | Production dependency graph, used by the CMS emoji/editor feature | No. Patched `clean-css@4.1.11` is outside `emoji-data-css`'s declared dependency line; forcing it is not a verified compatible update. |
| `emoji-data-css@1.0.1` | Low | Inherits GHSA-wxhq-pm8v-cw75; no separate CVE | project → `quill-emoji@0.2.0` → `emoji-data-css@1.0.1` | Production dependency graph, CMS editor feature | No maintained compatible release removes its `clean-css@3` dependency. |
| `quill@1.3.7` | Moderate | [GHSA-4943-9vgg-gr5r](https://github.com/advisories/GHSA-4943-9vgg-gr5r); CVE-2021-3163 | project → `quill@1.3.7`; also deduplicated through `quill-emoji@0.2.0`, `quill-image-resize-module@3.0.0`, and `react-quill@2.0.0` | Production application/CMS editor | No. The advisory has no patched 1.x release; moving to Quill 2 is a prohibited major migration. |
| `quill-emoji@0.2.0` | Moderate | Inherits GHSA-4943-9vgg-gr5r / CVE-2021-3163 and GHSA-wxhq-pm8v-cw75 | project → `quill-emoji@0.2.0` | Production application/CMS editor | No compatible maintained release. |
| `quill-image-resize-module@3.0.0` | Moderate | Inherits GHSA-4943-9vgg-gr5r / CVE-2021-3163 | project → `quill-image-resize-module@3.0.0` | Production application/CMS editor | No compatible release removes Quill 1. |
| `react-quill@2.0.0` | Moderate | Inherits GHSA-4943-9vgg-gr5r / CVE-2021-3163 | project → `react-quill@2.0.0` | Production application/CMS editor | No. npm's suggested `0.0.2` downgrade is a breaking major change and does not constitute a safe fix. |
| `react-router@6.30.6` | Moderate | [GHSA-wrjc-x8rr-h8h6](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6), CVE-2026-53669; [GHSA-337j-9hxr-rhxg](https://github.com/advisories/GHSA-337j-9hxr-rhxg), CVE-2026-53666 | project → `react-router-dom@6.30.6` → `react-router@6.30.6` | Production application routing | No. Both fixes require React Router 7.18+, a major routing migration. The SSR hydration advisory does not apply to this declarative client-rendered application, but npm still reports the installed package. |
| `react-router-dom@6.30.6` | Moderate | Inherits both React Router advisories above | project → `react-router-dom@6.30.6` | Production application routing | No. Patched line is 7.18+, a major migration. |
| `esbuild@0.21.5` | Moderate | [GHSA-67mh-4wv8-2f99](https://github.com/advisories/GHSA-67mh-4wv8-2f99); no CVE | project → `vite@5.4.21` → `esbuild@0.21.5` | Development/build tooling only; affects the local development server, not deployed static assets | No within Vite 5. Patched esbuild 0.25 is outside Vite 5's dependency line. |
| `vite@5.4.21` | High aggregate | [GHSA-4w7w-66w2-5vf9](https://github.com/advisories/GHSA-4w7w-66w2-5vf9), CVE-2026-39365; [GHSA-v6wh-96g9-6wx3](https://github.com/advisories/GHSA-v6wh-96g9-6wx3), CVE-2026-53632; [GHSA-fx2h-pf6j-xcff](https://github.com/advisories/GHSA-fx2h-pf6j-xcff), CVE-2026-53571; inherits GHSA-67mh-4wv8-2f99 | project → `vite@5.4.21`; also project → `@vitejs/plugin-react@4.7.0` → deduplicated `vite@5.4.21` | Development/build tooling only; the advisories concern the development server and Windows path handling, not the generated production bundle | No within Vite 5. The first fully patched line is Vite 6.4.3+, which is a prohibited major upgrade. |

## Why an earlier audit could be reported as zero

The current lockfile does not reproduce a zero-advisory full audit. The likely
source of the earlier result is the command's threshold semantics:
`npm audit --omit=dev --audit-level=high` exits successfully because the
production graph contains no high or critical vulnerability. It still reports
eight low/moderate vulnerable nodes. Treating that zero exit status as “zero
findings” conflates the failure threshold with the number of advisories.

The full current command, `npm audit --json`, includes development dependencies
and therefore also reports Vite as the single high-severity node. The audit
database is live, so results must always be recorded with the command, date,
lockfile, and severity counts rather than inferred from the process exit code.

## Risk disposition

- Do not expose `npm run dev` or `vite preview` to untrusted networks. The
  existing `dev` script uses `--host 0.0.0.0`, so local development should be
  limited by the host firewall until a separately reviewed Vite major upgrade.
- Existing HTML sanitisation remains an important compensating control for the
  legacy Quill path. A Quill 2/editor migration should be planned as a distinct
  behavioural work package.
- A React Router 7 migration should be planned and tested separately. The SSR
  hydration advisory is not reachable in the current declarative SPA mode;
  untrusted strings should nevertheless never be passed directly to navigation.
- Re-run the full audit regularly because compatible backports may become
  available later.
