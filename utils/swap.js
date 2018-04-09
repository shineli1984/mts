import { compose } from 'ramda'
import M from '../types/either-t-state-t-promise'

export default m => compose(
  M.lift,
  m => m.swap()
)(m)