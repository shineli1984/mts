import { compose } from 'ramda'
import getPathMapSave from '../utils/get-path-map-save'
import toEs6Promise from '../utils/to-es6-promise'
import get from '../utils/get'
import M from '../types/either-t-state-t-promise'

// a plain function
const f = b => b + ' converted'

// wrap it around getPathMapSave
const g = getPathMapSave(['a', 'b'])(f)('c')

// execute g with context
const computation = compose(
  toEs6Promise({ a: { b: 'state data' } }),

  get,

  g,

  M.of
)

computation({})
  .then(result =>
    console.log(result) // { a: { b: 'state data' }, c: 'state data converted' }
  )