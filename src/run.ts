import { colors } from '../deps.ts'
const { rgb24 } = colors

function getFormatCmd(params: string[]) {
  return [
    '$',
    // ['echo', 'hello world'] => $ echo "hello world"
    ...params.map((param) =>
      /\s/.test(param) ? JSON.stringify(param) : param,
    ),
  ].join(' ')
}

type RunOptions = Omit<Deno.CommandOptions, 'args'> & {
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
): Promise<Deno.ChildProcess>
/**
 * ```ts
 * run('echo', 'hello')
 * ```
 * @param opt
 * @param cmd
 */
export async function run(...cmd: string[]): Promise<Deno.ChildProcess>
/**
 *
 * @param opt
 * @param cmd
 * @returns
 */
export async function run(
  opt: RunOptions | string,
  ...cmd: string[]
): Promise<Deno.ChildProcess> {
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

  const [bin, ...args] = cmd

  const command = new Deno.Command(bin, {
    args: args,
    ...option,
  })

  const program = command.spawn()

  if (!option.wait) {
    return program
  }

  const status = await program.status

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

  return decoder.decode(output.stdout).trim()
}
