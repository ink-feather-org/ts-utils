import { GeneralAsyncFunction, PromiseRejectFunction, PromiseResolveFunction } from './tsutils'

class QueuedRequest<T> {
  constructor(private readonly request: GeneralAsyncFunction<never, T>,
    private readonly resolve: PromiseResolveFunction<T>,
    private readonly reject: PromiseRejectFunction) {}

  async execute() {
    try {
      this.resolve(await this.request())
    } catch (err) {
      this.reject(err)
    }
  }
}

/**
 * This class allows async functions to be executed in the order they were enqueued.
 * It guarantees that no functions execute concurrently and that they are executed in order.
 */
export default class PromiseChain {
  private queuedRequests = new Array<QueuedRequest<unknown>>()

  private handlingRequests = false

  private async startHandlingRequests(): Promise<void> {
    this.handlingRequests = true

    while (this.queuedRequests.length) {
      const nextReq = this.queuedRequests.shift()!
      await nextReq.execute()
    }

    this.handlingRequests = false
  }

  /**
   * Enqueues the specified async function for execution.
   * It will be added to an internal queue and executed once all prior functions have finished.
   * @param asyncFunction The async function to execute.
   * @return A promise tact is fulfilled once the function finished executing. It will contain the return value of the supplied function.
   */
  async enqueue<T>(asyncFunction: GeneralAsyncFunction<never, T>): Promise<T> {
    try {
      return await new Promise<T>((resolve, reject) => {
        this.queuedRequests.push(new QueuedRequest(asyncFunction, resolve, reject) as QueuedRequest<unknown>)
        if (!this.handlingRequests)
          this.startHandlingRequests()
      })
    } catch (err) {
      // improve stack traces for chrome
      if (Object.getOwnPropertyDescriptor(err, 'stack')?.configurable) {
        const originalStack = (err as Error).stack
        const newEx = Error()
        Object.defineProperty(err, 'stack', {
          get() {
            return `Inside PromiseChain:\n${originalStack}\nOutside PromiseChain:\n${newEx.stack}`
          }
        })
      }
      throw err
    }
  }
}
