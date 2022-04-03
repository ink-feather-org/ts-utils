/* Copyright 2021 The @ink-feather-org/ts-utils Contributors.
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>. */

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
export class PromiseChain {
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
   * @return A promise that is fulfilled once the asyncFunction has finished its execution. It will contain the return value of the supplied function.
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
          },
        })
      }
      throw err
    }
  }
}
