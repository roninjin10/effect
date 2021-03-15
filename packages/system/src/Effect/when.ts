// tracing: off

import * as O from "../Option"
import { succeed } from "./core"
import type { Effect } from "./effect"
import { map_ } from "./map"

/**
 * The moral equivalent of `if (p) exp`
 */
export function when_<R1, E1, A>(
  self: Effect<R1, E1, A>,
  predicate: () => boolean,
  __trace?: string
) {
  return predicate() ? map_(self, O.some, __trace) : succeed(O.none, __trace)
}

/**
 * The moral equivalent of `if (p) exp`
 *
 * @dataFirst when_
 */
export function when(predicate: () => boolean, __trace?: string) {
  return <R1, E1, A>(self: Effect<R1, E1, A>) => when_(self, predicate, __trace)
}
