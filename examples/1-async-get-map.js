import { compose } from 'ramda'
import getMap from '../utils/get-map'
import toEs6Promise from '../utils/to-es6-promise'
import M from '../types/either-t-state-t-promise'

// a function produce ES6 promise
const f = ({ a }) =>
  new Promise((resolve, reject) =>
    resolve(a + ' converted')
  )

// wrap it around getMap
const g = getMap(f)

// execute g with context
const computation = compose(
  toEs6Promise({ a: 'state data' }),

  g,

  M.of
)

computation({})
  .then(result =>
    console.log(result)
  ) // "state data converted"