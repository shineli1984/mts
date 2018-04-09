import { compose } from 'ramda'
import get from './get'
import fromEs6Promise from './from-es6-promise'

export default asyncFunction =>
  compose(
    fromEs6Promise(asyncFunction),
    get
  )