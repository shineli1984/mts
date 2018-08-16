import {always, compose, map} from 'ramda'
import daggy from 'daggy'
import {Tuple2} from 'fantasy-tuples'

const Writer = M => {

  const Writer = daggy.tagged('Writer', ['run'])

  Writer.of = function(x) {
    return Writer(() => Tuple2(x, M.empty()))
  }

  Writer.prototype.chain = function(f) {
    return Writer(() => {
      const result = this.run()
      const t = f(result._1).run()
      return Tuple2(t._1, result._2.concat(t._2))
    })
  }

  Writer.prototype.tell = function(y) {
    return Writer(() => {
      const result = this.run()
      return Tuple2(null, result._2.concat(y))
    })
  }

  Writer.prototype.map = function(f) {
    return Writer(() => {
      const result = this.run()
      return Tuple2(f(result._1), result._2)
    })
  }

  Writer.prototype.ap = function(b) {
    return this.chain((a) => b.map(a))
  }

  return Writer

}

Writer.WriterT = Monoid => Monad => {
  const WriterT = daggy.tagged('WriterT', ['run'])

  WriterT.lift =
    compose(
      WriterT,
      always,
      map(a => Tuple2(a, Monoid.empty()))
    )
  WriterT.of = a => {
    return WriterT(_ =>
      Monad.of(
        Tuple2(a, Monoid.empty())
      )
    )
  }

  WriterT.prototype.tell = function(y) {
    return WriterT(() => {
      const result = this.run()
      return result.map(t => {
        return Tuple2(null, t._2.concat(y))
      })
    })
  }

  WriterT.prototype.map = function(f) {
    return WriterT(() => {
      const result = this.run()
      return result.map(t => {
        return Tuple2(f(t._1), t._2)
      })
    })
  }
  WriterT.prototype.chain = function(f) {
    return WriterT(_ => {

      return this.run().chain(
        t =>
          f(t._1).run().map(
            inner =>
              Tuple2(inner._1, t._2.concat(inner._2))
          )
      )
    })
  }

  return WriterT
}

export default Writer