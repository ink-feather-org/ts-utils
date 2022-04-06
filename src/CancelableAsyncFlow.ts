/* Copyright 2021 The @ink-feather-org/ts-utils Contributors.
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>. */

/**
 * The CancelableAsyncFlow wraps a generator function and allows progress through the generator to be observed.
 * Furthermore, it provides cancellation facilities to abort the generator execution early.
 * {@link ProgressObserver}
 */
export class CancelableAsyncFlow<ARGS extends [], RET, PROGRESS> {
  /**
   * @param generatorFactory This generator factory will be used by the CancelableAsyncFlow to generate AsyncGenerators.
   */
  constructor(private readonly generatorFactory: (abortSignal: AbortSignal, ...args: ARGS) => AsyncGenerator<PROGRESS, RET, never>) {}

  /**
   * This function constructs an AsyncGenerator using the generatorFactory from the constructor.
   * @param abortSignal This abort signal can be used to interrupt the generator between two stages.
   * @param progressObserver The progress observer is passed to the generator as its first argument.
   * @param args Custom arguments to pass to the generator function.
   * @returns A promise that completes once the generator has finished its execution. It will contain the last return value of the generator function.
   */
  async start(abortSignal: AbortSignal, progressObserver: ProgressObserver<PROGRESS>, ...args: ARGS): Promise<RET> {
    const generator = this.generatorFactory(abortSignal, ...args)
    let ret
    do {
      if (abortSignal.aborted) {
        // call the generators finally
        await generator.return(undefined as unknown as RET)
        throw Error('Aborted')
      }
      if (ret)
        progressObserver.progress = ret.value as PROGRESS
      ret = await generator.next()
    } while (!ret.done)
    return ret.value as RET
  }
}

/**
 * Custom progress observer type.
 * It can be used to keep track of the {@link CancelableAsyncFlow}s progress.
 */
export interface ProgressObserver<T> {
  /**
   * Use this to pass your custom progress type to the generator function.
   */
  progress?: T
}
