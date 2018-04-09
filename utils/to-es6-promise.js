export default initialState => m =>
  new Promise(function(resolve, reject) {
    m.run.evalState(initialState).fork(a => {
      if (a.l) {
        reject(a.l)
      } else {
        resolve(a.r)
      }
    })
  })