/**
 * The CancelableAsyncFlow wraps a generator function and allows progress through the generator to be observed.
 * Furthermore, it provides cancellation facilities to abort the generator execution early.
 */
export default class CancelableAsyncFlow<ARGS extends [], RET, PROGRESS> {
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
