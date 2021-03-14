// tracing: off

import * as A from "../../Chunk"
import type { Predicate, Refinement } from "../../Function"
import { pipe } from "../../Function"
import * as O from "../../Option"
import * as T from "../_internal/effect"
import * as M from "../_internal/managed"
import * as Ref from "../_internal/ref"
import * as Pull from "../Pull"
import { Stream } from "./definitions"

/**
 * Transforms all elements of the stream for as long as the specified partial function is defined.
 */
export function collectWhileMap_<R, E, O, O2>(
  self: Stream<R, E, O>,
  f: (o: O) => O.Option<O2>
): Stream<R, E, O2> {
  return new Stream(
    pipe(
      M.do,
      M.bind("chunks", () => self.proc),
      M.bind("doneRef", () => T.toManaged(Ref.makeRef(false))),
      M.let("pull", ({ chunks, doneRef }) =>
        T.chain_(doneRef.get, (done) => {
          if (done) {
            return Pull.end
          } else {
            return pipe(
              T.do,
              T.bind("chunk", () => chunks),
              T.chain(({ chunk }) => {
                const remaining = A.collectWhileMap_(chunk, f)

                return T.as_(
                  T.when_(doneRef.set(true), () => remaining.length < chunk.length),
                  remaining
                )
              })
            )
          }
        })
      ),
      M.map(({ pull }) => pull)
    )
  )
}

/**
 * Transforms all elements of the stream for as long as the specified partial function is defined.
 */
export function collectWhileMap<O, O2>(f: (o: O) => O.Option<O2>) {
  return <R, E>(self: Stream<R, E, O>) => collectWhileMap_(self, f)
}

/**
 * Transforms all elements of the stream for as long as the specified partial function is defined.
 */
export function collectWhile_<R, E, O, O1 extends O>(
  self: Stream<R, E, O>,
  f: Refinement<O, O1>
): Stream<R, E, O1>
export function collectWhile_<R, E, O>(
  self: Stream<R, E, O>,
  f: Predicate<O>
): Stream<R, E, O>
export function collectWhile_<R, E, O>(
  self: Stream<R, E, O>,
  f: Predicate<O>
): Stream<R, E, O> {
  return new Stream(
    pipe(
      M.do,
      M.bind("chunks", () => self.proc),
      M.bind("doneRef", () => T.toManaged(Ref.makeRef(false))),
      M.let("pull", ({ chunks, doneRef }) =>
        T.chain_(doneRef.get, (done) => {
          if (done) {
            return Pull.end
          } else {
            return pipe(
              T.do,
              T.bind("chunk", () => chunks),
              T.chain(({ chunk }) => {
                const remaining = A.collectWhile_(chunk, f)

                return T.as_(
                  T.when_(doneRef.set(true), () => remaining.length < chunk.length),
                  remaining
                )
              })
            )
          }
        })
      ),
      M.map(({ pull }) => pull)
    )
  )
}

/**
 * Transforms all elements of the stream for as long as the specified partial function is defined.
 *
 * @dataFirst collectWhile_
 */
export function collectWhile<O, O1 extends O>(
  f: Refinement<O, O1>
): <R, E>(self: Stream<R, E, O>) => Stream<R, E, O1>
export function collectWhile<O>(
  f: Predicate<O>
): <R, E>(self: Stream<R, E, O>) => Stream<R, E, O>
export function collectWhile<O>(
  f: Predicate<O>
): <R, E>(self: Stream<R, E, O>) => Stream<R, E, O> {
  return (self) => collectWhile_(self, f)
}
