// tracing: off

import { asUnit } from "./asUnit"
import { chain_, suspend, unit } from "./core"
import type { Effect } from "./effect"

/**
 * The moral equivalent of `if (!p) exp`
 *
 * @dataFirst unless_
 */
export function unless(b: () => boolean, __trace?: string) {
  return <R, E, A>(self: Effect<R, E, A>) =>
    suspend(() => (b() ? unit : asUnit(self)), __trace)
}

/**
 * The moral equivalent of `if (!p) exp`
 */
export function unless_<R, E, A>(
  self: Effect<R, E, A>,
  b: () => boolean,
  __trace?: string
) {
  return suspend(() => (b() ? unit : asUnit(self)), __trace)
}

/**
 * The moral equivalent of `if (!p) exp` when `p` has side-effects
 *
 * @dataFirst unlessM_
 */
export function unlessM<R2, E2>(b: Effect<R2, E2, boolean>, __trace?: string) {
  return <R, E, A>(self: Effect<R, E, A>) => unlessM_(self, b, __trace)
}

/**
 * The moral equivalent of `if (!p) exp` when `p` has side-effects
 */
export function unlessM_<R2, E2, R, E, A>(
  self: Effect<R, E, A>,
  b: Effect<R2, E2, boolean>,
  __trace?: string
) {
  return chain_(b, (_) => (_ ? unit : asUnit(self)), __trace)
}
