import { assertEquals, assertRejects } from '../devDeps.ts'
import { run } from './run.ts'

const runPiped = (...args: string[]) =>
  run(
    {
      stderr: 'inherit',
      stdin: 'inherit',
      stdout: 'piped',
    },
    ...args,
  )
    .then((program) => program.output())
    .then((output) => new TextDecoder().decode(output).trim())

Deno.test('runPiped result', async () => {
  const output = await runPiped('echo', 'hello')

  assertEquals(output.trim(), 'hello')
})

Deno.test('runPiped throw error', async () => {
  await assertRejects(async () => {
    await runPiped('xxx', 'hello')
  })
})
