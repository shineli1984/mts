import { compose, propEq, when } from 'ramda'
import throwOn from '../utils/throw-on'
import toEs6Promise from '../utils/to-es6-promise'
import M from '../types/either-t-state-t-promise'

const s = compose(
  toEs6Promise({a: '123'}),

  throwOn(
    when(
      propEq('a', '123'),
      _ => new Error('Some error')
    )
  ),

  M.of
)

s({})
  .then(data => data)
  .catch(e => console.log(e))


