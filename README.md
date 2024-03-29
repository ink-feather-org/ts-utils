# @ink-feather-org/ts-utils

[![NPM Main CI](https://github.com/ink-feather-org/ts-utils/actions/workflows/npm_main.yml/badge.svg)](https://github.com/ink-feather-org/ts-utils/actions/workflows/npm_main.yml)

[Typedoc](https://ink-feather-org.github.io/ts-utils/)

This repository contains various util classes for typescript.
As they do not have external dependencies and are rather small I decided to cram them together into this package.

## CancelableAsyncFlow

The CancelableAsyncFlow wraps a generator function and allows progress through the generator to be observed.
Furthermore, it provides cancellation facilities to abort the generator execution early.

## PromiseChain

A promise chain is comparable to an asio::strand.
It allows promises to be executed in a specific order one at a time.

```typescript
import { PromiseChain, delay } from "@ink-feather-org/ts-utils"

/**
 * Both chains will execute in parallel but their individual queues will execute synchronously.
 */
async function main(): Promise<Number> {
    const chain1 = new PromiseChain()
    const chain2 = new PromiseChain()
    chain1.enqueue(async () => {
        console.log('C1 DELAY 1 START')
        await delay(2000)
        console.log('C1 DELAY 1 DONE')
    })
    const last1 = chain1.enqueue(async () => {
        console.log('C1 DELAY 2 START')
        await delay(2000)
        console.log('C1 DELAY 2 DONE')
    })
    chain2.enqueue(async () => {
        console.log('C2 DELAY 1 START')
        await delay(500)
        console.log('C2 DELAY 1 DONE')
    })
    const last2 = chain2.enqueue(async () => {
        console.log('C2 DELAY 2 START')
        await delay(1000)
        console.log('C2 DELAY 2 DONE')
        return 2
    })
    await last1
    return await last2
}
```

## tsutils

Minor typescript helper functions.

## Functions

* `equalsIgnoreCase`
* `getRandomArbitrary`
* `getRandomInt`
* `getRandomIntMatching`
* `storageAvailable`
* `getFileExtension`
* `intOrNaN`
* `delay`
* `impl` - Tests if an object declaration matches a specific typescript type.

### Types

* `GeneralAsyncFunction` - A generic type for promise based async functions.
* `PromiseResolveFunction` - Type of promise resolve function.
* `PromiseRejectFunction` - Type of promise reject function.
