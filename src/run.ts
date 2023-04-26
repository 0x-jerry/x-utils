import { colors } from '../deps.ts'
const { rgb24 } = colors

function getFormatCmd(cmd: string[]) {
  return [
    '$',
    // ['echo', 'hello world'] => $ echo 'hello world'
    ...cmd.map((param) => (/\s/.test(param) ? `'${param}'` : param)),
  ].join(' ')
}

type RunOptions = Omit<Deno.RunOptions, 'cmd'> & {
  /**
   * whether print to terminal.
   *
   * @default true
   */
  log?: boolean

  /**
   * whether wait for the program to end.
   *
   * @default true
   */
  wait?: boolean
}

/**
 * ```ts
 * run({log:false}, 'echo', 'hello')
 * ```
 * @param opt
 * @param cmd
 */
export async function run<T extends RunOptions>(
  opt: T,
  ...cmd: string[]
): Promise<Deno.Process<T & { cmd: string[] }>>
/**
 * ```ts
 * run('echo', 'hello')
 * ```
 * @param opt
 * @param cmd
 */
export async function run(
  ...cmd: string[]
): Promise<Deno.Process<Deno.RunOptions>>
/**
 *
 * @param opt
 * @param cmd
 * @returns
 */
export async function run(
  opt: RunOptions | string,
  ...cmd: string[]
): Promise<Deno.Process> {
  const option: RunOptions = {
    stderr: 'inherit',
    stdin: 'inherit',
    stdout: 'inherit',
    log: true,
    wait: true,
  }

  // Is not option
  if (typeof opt === 'string') {
    cmd.unshift(opt)
  } else {
    Object.assign(option, opt)
  }

  if (option.log) {
    console.log(rgb24(getFormatCmd(cmd), 0x999999))
  }

  const program = Deno.run({
    ...option,
    cmd: cmd,
  })

  if (!option.wait) {
    return program
  }

  const status = await program.status()
  program.close()

  if (!status.success) {
    throw status
  }

  return program
}

const decoder = new TextDecoder()

/**
 *
 * @param cmd
 * @returns
 */
export async function runPiped(...cmd: string[]) {
  const program = await run(
    {
      stdout: 'piped',
      stderr: 'inherit',
      stdin: 'inherit',
      log: false,
    },
    ...cmd,
  )

  const output = await program.output()
  return decoder.decode(output).trim()
}
