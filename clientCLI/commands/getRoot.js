const { clearEol } = require('../../utils')
module.exports = (sshConn) => {
  return new Promise((resolve, reject) => {
    sshConn.exec('pwd', (err, stream) => {
      if (err) return reject(err)
      stream.on('data', data => resolve(clearEol(data.toString())))
    })
  })
}