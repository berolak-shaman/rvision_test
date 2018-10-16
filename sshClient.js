const SSHClient = require('ssh2').Client
const runCommandHandler = require('./clientCLI')
const { print } = require('./utils')

exports.connect = params => {
  let conn = new SSHClient()
  print(`Connecting to ${params.host}...`)
  conn.on('ready', () => {
    print('Connection successful.')

    conn.shell({
      term: process.env.TERM,
      rows: process.stdout.rows,
      cols: process.stdout.columns
    }, (err, stream) => {
      runCommandHandler(conn, stream, params.host)

      stream.on('close', () => {
        conn.end()
      })
    })
  })

  conn.on('error', err => {
    print('Connection error: ', err)
    conn.end()
  })

  conn.connect(params)
}