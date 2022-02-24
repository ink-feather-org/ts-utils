export type GeneralAsyncFunction<ARGS extends [], RET> = (...args: ARGS) => Promise<RET>

export type PromiseResolveFunction<ARG> = (value: ARG | PromiseLike<ARG>) => void
export type PromiseRejectFunction = (reason?: any) => void

export function equalsIgnoreCase(...args: string[]): boolean {
  if (!args.length)
    return false
  const first = args[0]
  for (const string of args)
    if (!first.localeCompare(string, undefined, { sensitivity: 'accent' }))
      return false
  return true
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export function getRandomArbitrary(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

/**
 * https://stackoverflow.com/a/1527820/4479969
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Gets a random number matching the specified filter.
 * @param matching The function to test if the generated random number is suitable.
 */
export function getRandomIntMatching(min: number, max: number, matching: (number: number) => boolean): number {
  let id: number
  do {
    id = getRandomInt(min, max)
  } while (!matching(id))
  return id
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
 * Test is localStorage or sessionStorage is available.
 */
export function storageAvailable(type: 'localStorage' | 'sessionStorage'): boolean {
  let storage
  try {
    storage = window[type]
    const x = '__storage_test__'
    storage.setItem(x, x)
    storage.removeItem(x)
    return true
  } catch (e) {
    return (e instanceof DOMException && (
      // everything except Firefox
      e.code === 22
      // Firefox
      || e.code === 1014
      // test name field too, because code might not be present
      // everything except Firefox
      || e.name === 'QuotaExceededError'
      // Firefox
      || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')
      // acknowledge QuotaExceededError only if there's something already stored
      && (storage && storage.length !== 0)) === true
  }
}

export function getFileExtension(filename: string): string | undefined {
  return filename.split('.').pop()
}

/**
 * https://stackoverflow.com/questions/43417975/parse-an-integer-and-only-an-integer-in-javascript
 * Returns true if the supplied string contains an integer.
 */
export function intOrNaN(x: string): number {
  return /^\d+$/.test(x) ? +x : NaN
}

/**
 * Promise based delay.
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * https://stackoverflow.com/a/58718941/4479969
 * Tests if an object declaration matches a specific typescript type.
 */
export function impl<I>(i: I) { return i }
