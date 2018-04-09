import { when } from 'q'
import { chain, compose, ifElse, map, prop } from 'ramda'
import StateTPromise from '../types/state-t-promise'
import Either from '../types/either'
import M from '../types/either-t-state-t-promise'

export default isErrorToCatch => f =>
  compose(
    M.lift,
    chain(compose(
      either =>
        either.fold(
          compose(
            ifElse(
              isErrorToCatch,
              l => compose(
                prop('run'),
                f(l),
                M.of
              )({}),
              compose(
                StateTPromise.of,
                Either.Left
              )
            )
          ),
          compose(
            map(Either.of),
            StateTPromise.of
          )
        )
    )),
    prop('run')
  )