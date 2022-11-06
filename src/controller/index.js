module.exports = (container) => {
  const residentController = require('./residentController')(container)
  return { residentController }
}
