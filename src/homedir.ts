export function getHomedir(): string {
  const home = Deno.env.get('HOME') ?? Deno.env.get('USERPROFILE')

  return home!
}


export const homedir = getHomedir()
