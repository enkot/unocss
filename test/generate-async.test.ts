import { createGenerator } from '@unocss/core'
import { describe, expect, test } from 'vitest'

describe('generate-async', () => {
  test('rule-first', async () => {
    const order: number[] = []
    const uno = createGenerator({
      rules: [
        [/^rule$/, () => new Promise(resolve => setTimeout(() => {
          order.push(1)
          resolve('/* rule */')
        }, 10))],
      ],
      preflights: [
        {
          getCSS: () => new Promise(resolve => setTimeout(() => {
            order.push(2)
            resolve('/* preflight */')
          }, 20)),
        },
      ],
    })
    await uno.generate('rule')
    expect(order).eql([1, 2])
  })

  test('preflight-first', async () => {
    const order: number[] = []
    const uno = createGenerator({
      rules: [
        [/^rule$/, () => new Promise(resolve => setTimeout(() => {
          order.push(2)
          resolve('/* rule */')
        }, 20))],
      ],
      preflights: [
        {
          getCSS: () => new Promise(resolve => setTimeout(() => {
            order.push(1)
            resolve('/* preflight */')
          }, 10)),
        },
      ],
    })
    await uno.generate('rule')
    expect(order).eql([1, 2])
  })
})