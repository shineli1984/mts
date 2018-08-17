import { compose } from 'ramda'
import tapError from '../utils/tap-error'
import getMapSave from '../utils/get-map-save'
import getMap from '../utils/get-map'
import toEs6Promise from '../utils/to-es6-promise'
import M from '../types/either-t-state-t-promise'

const aFakeFunctionToSendErrorToLogServiceAsync = e => s =>
  new Promise((resolve, reject) => {
    console.log('Error logging function called')
    console.log('State: {a: ' + s.a + ', b: ' + s.b + '}')
    resolve('')
  })

const f = () => new Promise ((resolve, reject) => {
  reject(new Error('Some error here'))
})

const g = ({a}) => a + '4'

const s = compose(
  toEs6Promise({a: '123'}),

  tapError(
    e => s => e.message === 'Some error here' && s.b === '1234'
  )(
    aFakeFunctionToSendErrorToLogServiceAsync
  ),

  getMap(f), // all good until this function.

  getMapSave(g)('b'),

  M.of
)

s({})
  .then(data => console.log(data)) //
  .catch(e => console.log(e.message)) // "Some error here"


