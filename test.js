import test from 'ava'
import cueue from './src'

test('`push`', t => {
  const r = i => t.pass(i)
  const q = cueue(r)
  Array.from({ length: 20 }).forEach((_, i) => q.push(i))
})
