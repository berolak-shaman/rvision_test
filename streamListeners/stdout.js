const { Transform } = require('stream')
const { isEOL } = require('../utils')

class OutputParser extends Transform {
  constructor(options) {
    super(options)
    this.before = []
    this.after = []
    this.path = ''
  }

  getDir() { return this.path, this.path.split(/:|#/gi)[1] }

  getCurrentInput() {
    const input = this.before.concat(this.after.reverse())
    return input.join('').trim().split(' ')
  }

  _transform(chunk, encode, cb) {
    const str = chunk.toString()
    if (!this.path) {
      if (/:.*#/g.test(str)) this.path = str
    } else if (isEOL(str)) {
      this.before.length = 0
      this.after.length = 0
      this.path = ''
    } else {
      this.__changeBuffer(str)
    }
    this.push(chunk, encode)
    cb()
  }

  /**
   * Change saved input
   * @param {string} str 
   */
  __changeBuffer(str) {
    switch (str) {
    // left
    case '\b': return this.after.push(this.before.pop())
      // right
    case '\u001b[C': return this.before.push(this.after.pop())
      // beep)
    case '\u0007': return

    default:
      // backspace
      if (/[\b]\u{1b}/u.test(str)) return this.before.pop()
      // delete
      if (/^\u{1b}.+/u.test(str)) return this.after.pop()
      // up, down
      if (/^[\b]+/u.test(str)) {
        this.before.length = 0
        return this.before.push(str.replace(/[\b]/ug, ''))
      }
      return this.before.push(str)
    }
  }
}

module.exports = function create(options) { return new OutputParser(options) }