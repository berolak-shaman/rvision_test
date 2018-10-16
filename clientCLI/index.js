const { Stdin, Stdout } = require('../streamListeners')
const commandsHandlers = require('./commands')
const { printEol } = require('../utils')


module.exports = async (sshConn, stream, serverAddr) => {
  const stdout = Stdout()
  const rootDir = await commandsHandlers._getRootDirectory(sshConn)

  const inHandlers = {
    async onEnter() {
      const dir = stdout.getDir()
      const [cmd, filename] = stdout.getCurrentInput()
      let res

      switch (cmd) {
      case 'get':
        printEol()
        res = await commandsHandlers.get(sshConn, {
          filename, serverAddr, serverDir: dir === '~' ? rootDir : dir
        })
        break

      case 'put':
        printEol()
        res = await commandsHandlers.put(sshConn, {
          filename, serverAddr, serverDir: dir === '~' ? rootDir : dir
        })
        break

      default:
        break
      }
      // send Ctrl+C for clear console command if local command was started
      return res ? '\u0003' : res
    }
  }
  const stdin = Stdin(inHandlers)

  stream.pipe(stdout).pipe(process.stdout)
  process.stdin.setRawMode(true)
  process.stdin.pipe(stdin).pipe(stream)

  stream.on('close', () => {
    process.stdin.unref()
  })
}