import { compose } from 'ramda'
import get from './get'
import modifyAs from './modify-as'
import fromEs6Promise from './from-es6-promise'

export default asyncFunction => saveAs =>
  compose(
    modifyAs(saveAs),
    fromEs6Promise(asyncFunction),
    get
  )