import { when, reject } from 'q'
import getMap from './get-map'

const throwOn = getError => state => {
  const error = getError(state)

  if (error) {
    return reject(error)
  }
  return when(state)
}

export default getError =>
  getMap(throwOn(getError))