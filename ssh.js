const sshClient = require('./sshClient')

function getArgs() {
  const [username, password, host, port = 22] = process.argv[2].split(/:|@.*?/g)
  return { username, password, host, port }
}

sshClient.connect(getArgs())