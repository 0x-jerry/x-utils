import { createConfig } from './createConfig.ts'
import { assertEquals } from 'testing/asserts.ts'

interface IConf {
  test: number
  arr: { a: string }[]
}

Deno.test('read/save', async () => {
  let savedTimes = 0

  let savedData: IConf = {
    test: 0,
    arr: [
      {
        a: '1',
      },
    ],
  }

  const save = (d: IConf) => {
    savedData = d
    savedTimes++
    return Promise.resolve()
  }

  const [conf, ensureSaved] = createConfig(
    () => ({ test: 0, arr: [{ a: '1' }] }),
    save,
  )
  conf.test++
  conf.test++
  await ensureSaved()

  assertEquals(savedTimes, 1)
  assertEquals(savedData.test, 2)
  conf.test++
  conf.arr[0].a = '2'
  await ensureSaved()

  assertEquals(savedTimes, 2)
  assertEquals(savedData.test, 3)
  assertEquals(savedData.arr[0], { a: '2' })
})
