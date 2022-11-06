module.exports = (container) => {
  const logger = container.resolve('logger')
  const ObjectId = container.resolve('ObjectId')
  const {
    schemaValidator,
    schemas: {
      Resident
    }
  } = container.resolve('models')
  const { httpCode, serverHelper } = container.resolve('config')
  const { residentRepo } = container.resolve('repo')
  const addResident = async (req, res) => {
    try {
      const body = req.body
      const {
        error,
        value
      } = await schemaValidator(body, 'Resident')
      if (error) {
        return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
      }
      const item = await residentRepo.addResident(value)
      return res.status(httpCode.CREATED).json(item)
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR', ok: false })
    }
  }
  const deleteResident = async (req, res) => {
    try {
      const { id } = req.params
      if (id && id.length === 24) {
        await residentRepo.deleteResident(id)
        return res.status(httpCode.SUCCESS).json({ ok: true })
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST', ok: false })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ ok: false })
    }
  }
  const getResidentById = async (req, res) => {
    try {
      const { id } = req.params
      if (id && id.length === 24) {
        const item = await residentRepo.getResidentById(id)
        return res.status(httpCode.SUCCESS).json(item)
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST', ok: false })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR', ok: false })
    }
  }
  const updateResident = async (req, res) => {
    try {
      const { id } = req.params
      const body = req.body
      if (id && id.length === 24 && body) {
        const {
          error,
          value
        } = await schemaValidator(body, 'Resident')
        if (error) {
          return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
        }
        const item = await residentRepo.updateResident(id, value)
        return res.status(httpCode.SUCCESS).json(item)
      }
      return res.status(httpCode.BAD_REQUEST).json()
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ ok: false })
    }
  }
  const getResident = async (req, res) => {
    try {
      let {
        page,
        perPage,
        sort,
        ids
      } = req.query
      page = +page || 1
      perPage = +perPage || 10
      sort = +sort === 0 ? { _id: 1 } : +sort || { _id: -1 }
      const skip = (page - 1) * perPage
      const search = { ...req.query }
      const pipe = {}

      if (ids) {
        if (ids.constructor === Array) {
          pipe.id = { $in: ids }
        } else if (ids.constructor === String) {
          pipe.id = { $in: ids.split(',') }
        }
      }
      delete search.ids
      delete search.page
      delete search.perPage
      delete search.sort

      Object.keys(search).forEach(i => {
        const value = search[i]
        const pathType = (Resident.schema.path(i) || {}).instance || ''
        if (pathType.toLowerCase() === 'objectid') {
          pipe[i] = value ? ObjectId(value) : { $exists: false }
        } else if (pathType === 'Number') {
          pipe[i] = +value ? +value : 0
        } else if (pathType === 'String' && value.constructor === String) {
          pipe[i] = new RegExp(value.replace(/\\/g, '\\\\'), 'gi')
        } else {
          pipe[i] = value
        }
      })
      const data = await residentRepo.getResident(pipe, perPage, skip, sort)
      const total = await residentRepo.getCount(pipe)
      return res.status(httpCode.SUCCESS).json({
        perPage,
        skip,
        sort,
        data,
        total,
        page
      })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ ok: false, msg: 'UNKNOWN ERROR' })
    }
  }
  return {
    addResident,
    getResident,
    getResidentById,
    updateResident,
    deleteResident
  }
}
