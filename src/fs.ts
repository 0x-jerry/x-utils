export async function getDirFiles(path: string | URL) {
  const files = Deno.readDir(path)
  const filesInfo: Deno.DirEntry[] = []

  for await (const file of files) {
    filesInfo.push(file)
  }

  return filesInfo
}
