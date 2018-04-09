import { always, chain, compose, identity, map, prop } from 'ramda'

// types
import StateTPromise from '../types/state-t-promise'
import Either from '../types/either'
import M from '../types/either-t-state-t-promise'

export default f => compose(
  M.lift,
  chain(compose(
    either =>
      compose(
        map(
          either.fold(
            always(always(either)),
            always(Either.of)
          )
        ),
        StateTPromise.modify
      )(
        either.fold(
          always(a => identity(a)),
          a => f(a)
        )
      )
  )),
  prop('run')
)