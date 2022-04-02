/* Copyright 2021 The @ink-feather-org/ts-utils Contributors.
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>. */

/**
 * The CancelableAsyncFlow wraps a generator function and allows progress through the generator to be observed.
 * Furthermore, it provides cancellation facilities to abort the generator execution early.
 */
export class CancelableAsyncFlow<ARGS extends [], RET, PROGRESS> {
  constructor(private readonly generator: (abortSignal: AbortSignal, ...args: ARGS) => AsyncGenerator<PROGRESS, RET, never>) {}

  async start(abortSignal: AbortSignal, progressObserver: ProgressObserver<PROGRESS>, ...args: ARGS): Promise<RET> {
    const generator = this.generator(abortSignal, ...args)
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

export interface ProgressObserver<T> {
  progress?: T
}
