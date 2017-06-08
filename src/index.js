const noop = () => {}

const cueue = (func, delay = 0, context) => {
  if (typeof func !== 'function') {
    throw new TypeError('first argument must be function.')
  }

  if (typeof delay !== 'number' || delay < 0) {
    throw new TypeError('second argument must be positive number.')
  }

  let isRun
  let promise
  let pendding
  let resolve
  let reject
  let timer
  const q = []
  const result = []

  const initialize = () => {
    isRun = pendding = false
    resolve = reject = noop
    q.length = result.length = 0
  }

  const iterator = () => {
    try {
      if (q.length > 0) {
        result.push(func.apply(context, q.shift()))
        timer = setTimeout(iterator, delay)
      } else {
        clearTimeout(timer)
        resolve([...result])
        initialize()
      }
    } catch (e) {
      isRun = false
      reject(e)
    }
  }

  const registerResolver = (_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  }

  const executor = (resolve, reject) => {
    registerResolver(resolve, reject)
    iterator()
  }

  const run = () => {
    if (!isRun) {
      isRun = true
      if (pendding) {
        pendding = false
        iterator()
      } else {
        return promise = new Promise(executor)
      }
    }
    return promise
  }

  const add = args => q.push(args)

  const stop = () => {
    clearTimeout(timer)
    isRun = false
  }

  const clear = () => {
    stop()
    reject(new Error('Canceled queue executor.'))
    initialize()
  }

  initialize()

  return {
    run() {
      return run()
    },

    add(...args) {
      add(args)
    },

    push(...args) {
      add(args)
      return run()
    },

    stop() {
      if (isRun) pendding = true
      stop()
    },

    clear() {
      clear()
    },

    length() {
      return q.length
    },
  }
}

export default cueue
