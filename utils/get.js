import {chain, always} from 'ramda'
import M from '../types/either-t-state-t-promise'

export default chain(always(M.get))