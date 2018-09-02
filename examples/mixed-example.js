import {compose, apply, prop} from 'ramda'
import mapSave from '../utils/map-save'
import getPropsMapSave from '../utils/get-props-map-save'
import toEs6Promise from '../utils/to-es6-promise'
import get from '../utils/get'
import catchError from '../utils/catch-error'
import tapError from '../utils/tap-error'
import M from '../types/either-t-state-t-promise'
import getMapSave from '../utils/get-map-save'

const getIdFromUser = prop('id')

// predicate to check if an error is the error we can to catch.
const shouldErrorBeCaught = e => e.message === '403'

const aFakeFunctionToSendErrorToLogServiceAsync = e => s =>
  new Promise((resolve, reject) => {
    console.log('Error logging function called')
    console.log(s)
    resolve('')
  })

// simulate a data call
const fetchFriends = (id, limit, connection) =>
  new Promise((resolve, reject) => {
    setTimeout(
      _ => {
        if (id === 3) {
          resolve([
            {
              id: 1,
              name: 'Mike'
            },
            {
              id: 2,
              name: 'Mark'
            }
          ])
        } else if (id === 1) {
          reject(new Error('403'))
        } else {
          reject(new Error('Not Found'))
        }
      }
    , 50)
  })

const program = compose(
  toEs6Promise({
    limit: 1,
    friendsDbConnection: {some: 'connection'}
  }),

  get,

  catchError(
    shouldErrorBeCaught
  )(
    // if we catch the error, what do we do with it?
    e => getMapSave(
      s => `error: ${e.message}`
    )('error')
  ),

  tapError(
    e => s => e.message === 'Not Found'
  )(
    aFakeFunctionToSendErrorToLogServiceAsync
  ),

  getPropsMapSave(
    ['userId', 'limit', 'friendsDbConnection']
  )(
    apply(fetchFriends)
  )('friends'),

  mapSave(getIdFromUser)('userId'),

  M.of
)

program({id: 3, name: 'Mile'}).then(a => console.log(a)).catch(e => console.log(e))