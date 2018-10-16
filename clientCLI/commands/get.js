const fs = require('fs')
const path = require('path')
const { print, getServerPath, getFileNameFromPath } = require('../../utils')

module.exports = (sshConn, { filename, serverDir, serverAddr }) => {
  return new Promise((resolve, reject) => {
    sshConn.sftp((err, sftp) => {
      if (err) {
        print('Error open SFTP connection', err)
        return reject(err)
      }
      const serverPath = getServerPath(serverDir, filename)
      const localPath = path.join(path.resolve('.'), filename)
      print(`downloading ${serverAddr}:${serverPath} to 127.0.0.0:${localPath}`)
      const file = getFileNameFromPath(filename)

      const fileStream = fs.createWriteStream(file)
      fileStream.once('open', () => {
        fileStream.once('close', () => {
          print('File is downloaded successfully')
          resolve(true)
        })
        // TODO: add remove file on error
        sftp.createReadStream(serverPath).pipe(fileStream)
      })
    })
  })
}

