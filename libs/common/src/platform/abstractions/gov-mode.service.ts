import { Observable } from "rxjs";

/**
 * Detects whether the current environment is the Gov cloud environment.
 *
 * MVP implementation: checks whether the active client-side region is Gov. This
 * is sufficient to unblock other teams' FedRAMP-gated feature work but does
 * not validate the server-side environment. Will be replaced by a server-backed
 * check in https://bitwarden.atlassian.net/browse/PM-36520; consumers built
 * against this contract (isGovMode$, isGovMode()) will continue to work without
 * code changes when the implementation swaps.
 *
 * Consumers SHOULD prefer isGovMode$ where reactivity matters. The Promise
 * variant resolves once and may be cached by the caller; the Observable
 * variant emits whenever the environment region changes (and, post-PM-36520,
 * when the server-backed signal changes).
 */
export abstract class GovModeService {
  abstract isGovMode$: Observable<boolean>;
  abstract isGovMode(): Promise<boolean>;
}
