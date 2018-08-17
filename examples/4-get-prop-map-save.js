import { compose } from 'ramda'
import getPropMapSave from '../utils/get-prop-map-save'
import toEs6Promise from '../utils/to-es6-promise'
import get from '../utils/get'
import M from '../types/either-t-state-t-promise'

// a plain function
const f = ({ b }) => b + ' converted'

// wrap it around getPropMapSave
const g = getPropMapSave('a')(f)('c')

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