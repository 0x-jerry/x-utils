import { join } from 'path/mod.ts'

export async function which(cmd: string): Promise<string | null> {
  const PATH = Deno.env.get('PATH')
  const envPaths: string[] = PATH?.split(':') || []

  for (const p of envPaths) {
    const cmdPath = join(p, cmd)

    try {
      await Deno.lstat(cmdPath)
      return cmdPath
    } catch {
      // 
    }
  }

  return null
}
