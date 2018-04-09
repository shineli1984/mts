import { assoc, compose } from 'ramda'

// types
import modify from './modify'

export default compose(modify, assoc)