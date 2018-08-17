import { compose } from 'ramda'
import catchError from '../utils/catch-error'
import getMapSave from '../utils/get-map-save'
import getMap from '../utils/get-map'
import get from '../utils/get'
import toEs6Promise from '../utils/to-es6-promise'
import M from '../types/either-t-state-t-promise'

// async function with rejection
const f = _ => new Promise ((resolve, reject) => {
  reject(new Error('Some error here'))
})

// predicate to check if an error is the error we can to catch.
const shouldErrorBeCaught = e => e.message === 'Some error here'

const s = compose(
  toEs6Promise({a: '123'}),

  get,

  catchError(
    shouldErrorBeCaught
  )(
    // if we catch the error, what do we do with it?
    e => getMapSave(
      s => `${s.a} has not been changed because of error: ${e.message}`
    )('error')
  ),

  getMap(f),

  M.of
)

s({})
  .then(data =>
    console.log(data) // { a: '123', error: '123 has not been changed because of error: Some error here' }
  )


