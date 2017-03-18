/**
 * @param {Function} func
 * @param {number} [delay = 0]
 * @param {*?} context
 */
const cueue = (func, delay = 0, context) => {
  if (typeof func !== 'function') {
    throw new TypeError('first argument must be function.')
  }

  if (typeof delay !== 'number' || delay < 0) {
    throw new TypeError('second argument must be positive number.')
  }

  let isRun = false
  let promise
  let timer
  const q = []
  const result = []

  const iterator = resolve => {
    if (q.length > 0) {
      result.push(
        func.apply(context, q.shift())
      )
      timer = setTimeout(() => iterator(resolve), delay)
    } else {
      clearTimeout(timer)
      resolve([...result])
      result.length = 0
      isRun = false
    }
  }

  const run = () => {
    if (!isRun) {
      isRun = true
      return promise = new Promise((...a) => {
        try {
          iterator(...a)
        } catch (e) {
          const [, reject] = a
          reject(e)
        }
      })
    }
    return promise
  }

  const add = args => q.push(args)

  const stop = () => {
    clearTimeout(timer)
    isRun = false
  }

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
      stop()
    },

    clear() {
      stop()
      q.length = 0
    },

    length() {
      return q.length
    },
  }
}

export default cueue
