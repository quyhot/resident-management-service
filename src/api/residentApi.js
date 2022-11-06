module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { residentController } = container.resolve('controller')
  const { basePath } = serverSettings
  app.get(`${basePath}/resident`, residentController.getResident)
  app.get(`${basePath}/resident/:id`, residentController.getResidentById)
  app.put(`${basePath}/resident/:id`, residentController.updateResident)
  app.delete(`${basePath}/resident/:id`, residentController.deleteResident)
  app.post(`${basePath}/resident`, residentController.addResident)
}
