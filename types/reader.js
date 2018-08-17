import {always, identity} from 'ramda'
import daggy from 'daggy'

const Reader = daggy.tagged('Reader', ['run'])

Reader.ask = Reader(identity)
Reader.of = a => Reader(always(a))

Reader.prototype.map = function(f) {
  return Reader(e =>
    f(this.run(e))
  )
}

Reader.prototype.chain = function(f) {
  return Reader((e) => f(this.run(e)).run(e));
}

Reader.prototype.ap = function(a) {
  return this.chain((f) => a.map(f));
};

// Transformer
Reader.ReaderT = (M) => {
  const ReaderT = daggy.tagged('ReaderT', ['run'])

  ReaderT.lift = (m) => ReaderT(always(m))

  // MonadState
  if (M.get) {
    ReaderT.get = ReaderT.lift(M.get)
  }

  if (M.put) {
    ReaderT.put = ReaderT.lift(M.put)
  }

  // ReaderT
  ReaderT.of = (a) => {
    return ReaderT(_ => M.of(a))
  }

  ReaderT.ask = ReaderT(e => M.of(e))

  ReaderT.prototype.chain = function(f) {
    return ReaderT((e) => {
      return this.run(e).chain((a) => f(a).run(e))
    })
  }

  ReaderT.prototype.map = function(f) {
    return this.chain((a) => ReaderT.of(f(a)))
  }

  ReaderT.prototype.ap = function(a) {
    return this.chain((f) => a.map(f))
  }

  return ReaderT
}

export default Reader