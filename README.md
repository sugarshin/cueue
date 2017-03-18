# cueue

[![CircleCI][circleci-image]][circleci-url]
[![Coverage Status][coveralls-image]][coveralls-url]

[![Dependency Status][david-image]][david-url]
[![Devdependency Status][david-dev-image]][david-dev-url]
[![npm version][npm-image]][npm-url]
[![License][license-image]][license-url]

Tiny, Easy queueing on Promise based.

```sh
yarn add cueue
```

## Usage

```js
import cueue from 'cueue'

const r = i => {
  console.info(i)
  return `iteratee ${i}`
}
const q = cueue(r, 200)
Array.from({ length: 40 }).forEach((_, i) => q.add(i))
q.run().then((...a) => console.info(...a))
```

## API

- `.add(...args)`
- `.run()` return `{Promise}`
- `.push(...args)` - return `{Promise}`
- `.stop()`
- `.clear()`
- `.length()` return `{number}`

## License

[MIT][license-url]

© sugarshin

[circleci-image]: https://circleci.com/gh/sugarshin/cueue/tree/master.svg?style=svg&circle-token=
[circleci-url]: https://circleci.com/gh/sugarshin/cueue/tree/master
[coveralls-image]: https://coveralls.io/repos/github/sugarshin/cueue/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/sugarshin/cueue?branch=master
[npm-image]: https://img.shields.io/npm/v/cueue.svg?style=flat-square
[npm-url]: https://www.npmjs.org/package/cueue
[david-image]: https://david-dm.org/sugarshin/cueue.svg?style=flat-square
[david-url]: https://david-dm.org/sugarshin/cueue
[david-dev-image]: https://david-dm.org/sugarshin/cueue/dev-status.svg?style=flat-square
[david-dev-url]: https://david-dm.org/sugarshin/cueue#info=devDependencies
[license-image]: https://img.shields.io/:license-mit-blue.svg?style=flat-square
[license-url]: https://sugarshin.mit-license.org/
