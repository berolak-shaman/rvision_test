const path = require('path')
const { EOL } = require('os')

/**
 * Print to console with time
 */
exports.print = (...data) => {
  const date = new Date()
  const dateStr = `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`
  console.log(dateStr, ...data) // eslint-disable-line no-console
}

/**
* Check is string contained EOL chars
* @param {string} str 
*/
exports.isEOL = str => /\r?\n|\r$/u.test(str)

exports.clearEol = str => str.replace(/\r?\n|\r$/u, '')

exports.printEol = () => console.log(EOL) // eslint-disable-line no-console

/**
 * Split command line. First element in result is command
 * @prop {string} str String for parse
 */
exports.parseCmd = str => str.split(' ')

/**
 * Return path/to/file
 */
exports.getServerPath = (dir, filename = '') => {
  return filename[0] === '/'
    ? filename
    : `${dir}/${filename}`
}

exports.getLocalPath = filePath => {
  if (filePath[0] === '/') return filePath
  if (/:\\/g.test(filePath)) return filePath
  return path.join(path.resolve('.'), filePath)
}

/**
 * Get filename from path
 * @param {string} path
 */
exports.getFileNameFromPath = (path) => {
  const parsed = path.split(/\\\\|\//)
  return parsed.pop()
}