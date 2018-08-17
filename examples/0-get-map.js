import { compose } from 'ramda'
import getMap from '../utils/get-map'
import toEs6Promise from '../utils/to-es6-promise'
import M from '../types/either-t-state-t-promise'

// a plain function
const f = ({ a }) =>
  a + ' converted'

// wrap it around getMap
const g = getMap(f)

// execute g with context
const computation = compose(
  toEs6Promise({
    a: 'state data'
  }), // run computation defined below with initial state and convert the result to ES6 promise

  g, // construct computation using g with state specified later

  M.of // create a instance of M
)

computation({})
  .then(result =>
    console.log(result) // "state data converted"
  )