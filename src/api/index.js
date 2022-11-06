module.exports = (app, container) => {
  const { verifyCMSToken } = container.resolve('middleware')
  // app.use(verifyCMSToken)
  require('./residentApi')(app, container)
}
