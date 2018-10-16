const { Transform } = require('stream')
const { isEOL } = require('../utils')

class UserInputWatcher extends Transform {
  constructor(handlers = {}, options) {
    super(options)
    this.handlers = handlers
    this.cmdBufferArr = []
    this.cmdCharArr = []
  }

  clearTmp() {
    this.cmdBufferArr.length = 0
    this.cmdCharArr.length = 0
  }

  getHandler(key) {
    const handler = this.handlers[key]
    return typeof handler === 'function' ? handler : noop
  }

  async _transform(chunk, encode, cb) {
    const str = chunk.toString()
    if (isEOL(str)) {
      const message = await this.getHandler('onEnter')() || chunk
      this.push(message)
      return cb()
    }

    this.push(chunk, encode)
    cb()
  }
}

module.exports = function create(handlers) {
  return new UserInputWatcher(handlers)
}

function noop() { }