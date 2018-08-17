import { always, compose, chain, ifElse } from 'ramda'
import { when } from 'q'
import swap from './swap'
import M from '../types/either-t-state-t-promise'
import Either from '../types/either'
import StateTPromise from '../types/state-t-promise'
import Promise from '../types/promise'

export default isErrorToHandle => errorHandler =>
  compose(
    swap,
    chain(err =>
      compose(
        M,
        chain(compose(
          StateTPromise.lift,
          p => new Promise(resolve => {
            p
              .then(_ => resolve(Either.of(err)))
              .catch(_ => resolve(Either.of(err)))
          }),
          when,
          ifElse(
            isErrorToHandle(err),
            errorHandler(err),
            always
          )
        )),
        always(StateTPromise.get)
      )(err),
    ),
    swap
  )