import test from 'ava'
import cueue from './src'

[0, 100].forEach(delay => {
  test(`\`add()\` to \`run()\` ${delay}, delayed`, async t => {
    const func = i => i
    const q = cueue(func, delay)
    Array.from({ length: 10 }).forEach((_, i) => q.add(i))
    const result = await q.run()
    t.is(result.length, 10)
    t.is(q.length(), 0)
    result.forEach((n, i) => t.is(n, i))
  })

  test(`incremental \`push()\` ${delay}, delayed`, async t => {
    const func = i => i
    const q = cueue(func, delay)
    let p
    const increment = (ms, max) => {
      let n = 0
      let id = setInterval(() => {
        if (n < max) {
          p = q.push(n++)
        } else {
          clearInterval(id)
        }
      }, ms)
    }
    Array.from({ length: 10 }).forEach((_, i) => p = q.push(i))
    increment(delay, 20)
    const results = await p
    t.is(results.length, 30)
    t.is(q.length(), 0)
  })

  test(`\`push()\` ${delay}, delayed`, async t => {
    const func = i => i
    const q = cueue(func, delay)
    const p = Array.from({ length: 10 }).map((_, i) => q.push(i))
    const results = await Promise.all(p)
    t.is(results.length, 10)
    results.forEach(r => r.forEach((n, i) => t.is(n, i)))
    const result = await Promise.race(p)
    t.is(result.length, 10)
    t.is(q.length(), 0)
    result.forEach((n, i) => t.is(n, i))
  })

  test(`\`stop()\` ${delay}, delayed`, async t => {
    const func = i => i
    const q = cueue(func, delay)
    Array.from({ length: 20 }).map((_, i) => q.add(i))
    setTimeout(() => q.stop(), 500)
    setTimeout(() => q.run(), 1000)
    const result = await q.run()
    t.is(result.length, 20)
    t.is(q.length(), 0)
    result.forEach((n, i) => t.is(n, i))
  })

  test(`\`clear()\` ${delay}, delayed`, async t => {
    const func = i => i
    const q = cueue(func, delay)
    Array.from({ length: 10 }).forEach((_, i) => q.add(i))
    setTimeout(() => q.clear(), 0)
    const p = q.run()
    const error = await t.throws(p)
    t.is(q.length(), 0)
    t.is(error.message, 'Canceled queue executor.')
  })

  test(`length() ${delay}, delayed`, t => {
    const q = cueue(() => {}, delay)
    q.add()
    q.add()
    q.add()
    t.is(q.length(), 3)
  })

  test(`nothig ${delay}, delayed`, t => {
    const q = cueue(() => {}, delay)
    q.stop()
    q.clear()
    t.is(q.length(), 0)
    t.pass()
  })

  test(`invalid arguments ${delay}, delayed`, t => {
    const error0 = t.throws(() => cueue(), TypeError)
    t.is(error0.message, 'first argument must be function.')
    const error1 = t.throws(() => cueue(() => {}, '🦄'), TypeError)
    t.is(error1.message, 'second argument must be positive number.')
  })

  test(`throw exeption in iterator ${delay}, delayed`, async t => {
    const func = i => {
      if (i < 5) {
        return i
      } else {
        throw new Error('🙏')
      }
    }
    const q = cueue(func, delay)
    Array.from({ length: 10 }).forEach((_, i) => q.add(i))
    let result
    try {
      result = await q.run()
    } catch (e) {
      t.falsy(result)
      t.is(e.message, '🙏')
      t.is(q.length(), 4)
    }
  })
})
