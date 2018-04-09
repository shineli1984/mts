import { compose, of } from 'ramda'
import getPathMapSave from './get-path-map-save'

export default compose(
  getPathMapSave,
  of
)