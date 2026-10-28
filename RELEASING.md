# npm releases

The manual **Release packages** workflow runs on `main` and defaults to
`dry_run: true`. It repeats the release checks, packs all five packages, and
previews publication. A dry-run does not publish packages or push tags.

## First npm release

1. Confirm that the publishing account can create public packages in the
   `@thruputchain` npm organization.
2. Add a granular npm write token as the repository Actions secret `NPM_TOKEN`.
   The token must permit package creation in this scope and non-interactive
   publication with the organization's 2FA policy. Do not put tokens in files.
3. Merge the publishing changes and run the workflow with `dry_run: true`.
4. After explicit release approval, run it with `dry_run: false`.

The first npm release keeps version **0.19.1**. Publication order is xdr,
protocol, contract-spec, rpc, then gateway. Publish client **0.25.0** next,
then React **0.9.0** from their repositories.

The workflow uses `publishConfig` to select public npm. It retains GitHub
Packages for dependency installs until the complete npm release set exists.
Then switch scope configuration and lockfiles to npm and test anonymous clean
installs. Existing GitHub Packages versions remain available.

## Tags and retries

Successful publication creates `npm-v<version>` at the tested commit. Existing
`v<version>` tags identify the earlier GitHub Packages releases and stay unchanged.
A retry skips a version only when its npm tarball integrity matches the local
package exactly. A different tarball or a tag at another commit stops the release.
Retry a partial publication from the same commit.

These repositories are private. This workflow uses token authentication and
does not request public provenance. Dry-run success does not prove npm scope
ownership or token permissions.
