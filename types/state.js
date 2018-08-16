var Tuple2 = require('fantasy-tuples').Tuple2,
  daggy = require('daggy'),
  State = daggy.tagged('State', ['run']);

// Methods
State.of = function(a) {
  return State(function(b) {
    return Tuple2(a, b);
  });
};
State.prototype.chain = function(f) {
  var state = this;
  return State(function(s) {
    var result = state.run(s);
    return f(result._1).run(result._2);
  });
};
State.get = State(function(s) {
  return Tuple2(s, s);
});
State.modify = function(f) {
  return State(function(s) {
    return Tuple2(null, f(s));
  });
};
State.put = function(s) {
  return State.modify(function(a) {
    return s;
  });
};
State.prototype.evalState = function(s) {
  return this.run(s)._1;
};
State.prototype.exec = function(s) {
  return this.run(s)._2;
};

// Derived
State.prototype.map = function(f) {
  return this.chain(function(a) {
    return State.of(f(a));
  });
};
State.prototype.ap = function(a) {
  return this.chain(function(f) {
    return a.map(f);
  });
};

// Transformer
State.StateT = function(M) {
  var StateT = daggy.tagged('StateT', ['run']);
  StateT.lift = function(m) {
    return StateT(function(b) {
      return m.map(function(c) {
        return Tuple2(c, b);
      });
    });
  };
  StateT.of = function(a) {
    return StateT(function(b) {
      return M.of(Tuple2(a, b));
    });
  };
  StateT.prototype.chain = function(f) {
    var state = this;
    return StateT(function(s) {
      var result = state.run(s);
      return result.chain(function(t) {
        return f(t._1).run(t._2);
      });
    });
  };
  StateT.get = StateT(function(s) {
    return M.of(Tuple2(s, s));
  });
  StateT.modify = function(f) {
    return StateT(function(s) {
      return M.of(Tuple2(null, f(s)));
    });
  };
  StateT.put = function(s) {
    return StateT.modify(function(a) {
      return s;
    });
  };
  StateT.prototype.evalState = function(s) {
    return this.run(s).map(function(t) {
      return t._1;
    });
  };
  StateT.prototype.exec = function(s) {
    return this.run(s).map(function(t) {
      return t._2;
    });
  };
  StateT.prototype.map = function(f) {
    return this.chain(function(a) {
      return StateT.of(f(a));
    });
  };
  StateT.prototype.ap = function(a) {
    return this.chain(function(f) {
      return a.map(f);
    });
  };
  return StateT;
};

// Export
if(typeof module != 'undefined')
  module.exports = State;
