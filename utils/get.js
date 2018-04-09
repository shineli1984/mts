import { always, chain, compose, map } from 'ramda'

// types
import StateTPromise from '../types/state-t-promise'
import Either from '../types/either'
import M from '../types/either-t-state-t-promise'

export default chain(compose(
  M.lift,
  map(Either.of),
  always(StateTPromise.get)
))