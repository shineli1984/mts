import {compose, apply, prop} from 'ramda'
import mapSave from '../utils/map-save'
import getPropsMapSave from '../utils/get-props-map-save'
import toEs6Promise from '../utils/to-es6-promise'
import get from '../utils/get'
import M from '../types/either-t-state-t-promise'

const getIdFromUser = prop('id')

// simulate a data call
const fetchFriends = (id, limit, connection) =>
  new Promise((resolve, reject) => {
    setTimeout(
      _ => {
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
      }
    , 50)
  })

const program = compose(
  toEs6Promise({
    limit: 1,
    friendsDbConnection: {some: 'connection'}
  }),
  get,
  getPropsMapSave(
    ['userId', 'limit', 'friendsDbConnection']
  )(
    apply(fetchFriends)
  )('friends'),
  mapSave(getIdFromUser)('userId'),
  M.of
)

program({id: 3, name: 'Mile'}).then(a => console.log(a))