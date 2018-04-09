import { compose, map, path } from 'ramda'
import get from './get'
import modifyAs from './modify-as'
import fromEs6Promise from './from-es6-promise'

export default pathToGet => asyncFunction => saveAs =>
  compose(
    modifyAs(saveAs),
    fromEs6Promise(asyncFunction),
    map(path(pathToGet)),
    get,
  )