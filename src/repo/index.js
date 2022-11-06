const repo = (container) => {
  const residentRepo = require('./residentRepo')(container)
  return { residentRepo }
}
const connect = (container) => {
  const dbPool = container.resolve('db')
  if (!dbPool) throw new Error('Connect DB failed')
  return repo(container)
}

module.exports = { connect }
