import { compose } from 'ramda'
import getMapSave from '../utils/get-map-save'
import toEs6Promise from '../utils/to-es6-promise'
import get from '../utils/get'
import M from '../types/either-t-state-t-promise'

const f = ({ a }) => a + ' converted'

// wrap it around getMapSave
const g = getMapSave(f)('b')

// execute g with context
const computation = compose(
  toEs6Promise({ a: 'state data' }),

  get, // get all state values, since after saving to save by g, the value in the M is gone.

  g,

  M.of
)

computation({})
  .then(result =>
    console.log(result) // { a: 'state data', b: 'state data converted' }
  )