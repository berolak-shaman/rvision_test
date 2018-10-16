const fs = require('fs')
const { print, getServerPath, getLocalPath, getFileNameFromPath } = require('../../utils')

module.exports = (sshConn, { filename, serverDir, serverAddr }) => {
  return new Promise((resolve, reject) => {
    sshConn.sftp((err, sftp) => {
      if (err) {
        print('Error open SFTP connection', err)
        return reject(err)
      }
      const file = getFileNameFromPath(filename)
      const serverPath = getServerPath(serverDir, file)
      const localPath = getLocalPath(filename)
      print(`uploading 127.0.0.0:${localPath} to ${serverAddr}:${serverPath}`)
      const fileStream = fs.createReadStream(filename)
      fileStream.once('open', () => {
        fileStream.once('close', () => {
          print('File is uploaded successfully')
          resolve(true)
        })
        fileStream.pipe(sftp.createWriteStream(serverPath))
      })
    })
  })
}