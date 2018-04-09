import { chain, compose } from "ramda"
import { when } from "q"

// types
import StateTPromise from "../types/state-t-promise"
import Promise from "../types/promise"
import Either from "../types/either"
import M from "../types/either-t-state-t-promise"

export default asyncFunction => compose(
  chain(compose(
    M.lift,
    StateTPromise.lift,
    p => new Promise(resolve => {
      p
        .then(x => resolve(Either.of(x)))
        .catch(e => resolve(Either.Left(e)))
    }),
    when,
    asyncFunction
  ))
)