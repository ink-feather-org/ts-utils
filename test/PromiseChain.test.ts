/* Copyright 2021 The @ink-feather-org/ts-utils Contributors.
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

/* eslint-disable import/no-unresolved,node/no-unpublished-import */
import { describe, it } from 'mocha'
import assert from 'assert'

import { PromiseChain, delay } from '../src/index'

describe('PromiseChain', () => {
  it('two chains', async () => {
    const out = new Array<string>()

    const chain1 = new PromiseChain()
    const chain2 = new PromiseChain()

    const first1 = chain1.enqueue(async () => {
      out.push('C1D1S')
      await delay(2000)
      out.push('C1D1D')
      return 1
    })
    const last1 = chain1.enqueue(async () => {
      out.push('C1D2S')
      await delay(2000)
      out.push('C1D2D')
      return 2
    })
    const first2 = chain2.enqueue(async () => {
      out.push('C2D1S')
      await delay(500)
      out.push('C2D1D')
      return 3
    })
    const last2 = chain2.enqueue(async () => {
      out.push('C2D2S')
      await delay(2000)
      out.push('C2D2D')
      return 4
    })
    assert.equal(await first1, 1)
    assert.equal(await last1, 2)
    assert.equal(await first2, 3)
    assert.equal(await last2, 4)
    assert.deepStrictEqual(out, [
      'C1D1S',
      'C2D1S',
      'C2D1D',
      'C2D2S',
      'C1D1D',
      'C1D2S',
      'C2D2D',
      'C1D2D'
    ], 'PromiseChain order violated!')
  }).timeout(60000)

  it('Exception', async () => {
    const chain = new PromiseChain()
    const p1 = chain.enqueue(async () => {
      await delay(100)
      throw 'Fail'
    })
    const p2 = chain.enqueue(async () => {
      await delay(100)
      return 10
    })

    assert.strictEqual(await p2, 10)
    await assert.rejects(p1)
  })
})
