import { getDirFiles } from '../fs.ts'
import { assert } from '../../devDeps.ts'
import { path } from '../../deps.ts'

Deno.test('#', async () => {
  const filePath = path.parse(new URL(import.meta.url).pathname)
  const files = await getDirFiles(filePath.dir)

  assert(files.length === 1)
  assert(files[0].name === 'fs.test.ts')
})
