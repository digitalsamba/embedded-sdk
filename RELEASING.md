# Releasing

Merging into the `release` branch publishes `@digitalsamba/embedded-sdk` to npm
(see `.github/workflows/main.yml`). All work lands on `master` first; `release`
only ever receives merges from `master`.

## Branches

| Branch          | Purpose                                                                                                                         |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `master`        | Integration branch. Features, fixes and version bumps are merged here.                                                          |
| `release-X.Y.Z` | Short-lived branch cut from `master` that carries the version bump for one release. Merged into `master`, never into `release`. |
| `release`       | Publish trigger. A push to it publishes to npm, then tags and creates the GitHub Release.                                       |

> The GitHub default branch is currently `release`, so new PRs default to it.
> **Always set the PR base explicitly** (`master` for features and bumps,
> `release` only for the final `master` → `release` PR).

## Steps

1. **Merge the features** you want to ship into `master`.
2. **Cut the bump branch** from an up-to-date `master`:
   ```sh
   git checkout master && git pull
   git checkout -b release-X.Y.Z
   ```
3. **Bump the version** in `package.json` (`"version": "X.Y.Z"`).
4. **Add a `CHANGELOG.md` entry** at the top, same format as the existing ones:

   ```text
   ## [vX.Y.Z] - YYYY-MM-DD
   * Short description ([#abcd1234](https://github.com/digitalsamba/embedded-sdk/commit/<full-sha>)).
   ```

5. **Build:** `yarn build`. This rewrites `PACKAGE_VERSION` in `src/utils/vars.ts`
   from `package.json` (via `tools/version.js`) and regenerates `dist/`.
6. **Commit everything** in one commit, e.g. `bump version to X.Y.Z`. A bump
   touches: `package.json`, `CHANGELOG.md`, `src/utils/vars.ts` and the `dist/`
   files that embed the version or the build hash.
7. **Open a PR `release-X.Y.Z` → `master`** and merge it.
8. **Open a PR `master` → `release`** and merge it. This is the "ship it" step.
9. **CI does the rest** when `release` is pushed:

   - checks that `CHANGELOG.md` has an entry for the version (fails before
     publishing if it doesn't),
   - publishes to npm (OIDC trusted publishing, no token),
   - creates the `vX.Y.Z` tag on the merge commit and a `Release vX.Y.Z` GitHub
     Release whose notes are that version's `CHANGELOG.md` entry.

   Check the run in the repo's Actions tab, and that the new version is on
   [npm](https://www.npmjs.com/package/@digitalsamba/embedded-sdk).

## Things to watch

- **`dist/` is committed and published as-is.** CI does not run `yarn build`,
  so a bump without a rebuilt `dist/` publishes the old bundle under the new
  version number. Always run `yarn build` before committing the bump.
- **`master` → `release` without a bump fails.** npm rejects a version that is
  already published, so the publish job goes red. Nothing is released.
- **Running the workflow manually (`workflow_dispatch`) really publishes** the
  version on the branch it is run from. It does not create a tag or Release.
- **The tag/Release step is skipped if `vX.Y.Z` already exists**, so re-running
  the job is safe.
- **Release notes come only from `CHANGELOG.md`**, so they never include other
  versions' changes. Versions that were published without a tag (e.g. 0.0.57)
  don't affect the next release's notes.
- `temp/codesandbox/` is a stale demo bundle and is not part of the release.

## Known gaps

The process still has manual parts that can be automated later: building in CI
instead of committing `dist/`, a CI check that `package.json`, `vars.ts` and
`CHANGELOG.md` agree, and a "prepare release" workflow that opens the bump PR.
