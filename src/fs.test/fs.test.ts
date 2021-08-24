import { getDirFiles } from '../fs.ts'
import { assert } from 'testing/asserts.ts'
import {parse} from 'path/mod.ts'

Deno.test('#', async () => {
  const path = parse(new URL(import.meta.url).pathname)
  const files = await getDirFiles(path.dir)

  assert(files.length === 1)
  assert(files[0].name === 'fs.test.ts')
})
