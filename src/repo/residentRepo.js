module.exports = container => {
  const { schemas } = container.resolve('models')
  const { Resident } = schemas
  const addResident = (data) => {
    const n = new Resident(data)
    return n.save()
  }
  const getResidentById = (id) => {
    return Resident.findById(id)
  }
  const deleteResident = (id) => {
    return Resident.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updateResident = (id, n) => {
    return Resident.findByIdAndUpdate(id, n, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const checkIdExist = (id) => {
    return Resident.findOne({ id })
  }
  const getCount = (pipe = {}) => {
    return Resident.countDocuments(pipe)
  }
  const getResidentAgg = (pipe) => {
    return Resident.aggregate(pipe)
  }
  const getResident = (pipe, limit, skip, sort) => {
    return Resident.find(pipe).limit(limit).skip(skip).sort(sort)
  }
  const getResidentNoPaging = (pipe) => {
    return Resident.find(pipe)
  }
  const removeResident = (pipe) => {
    return Resident.deleteMany(pipe)
  }
  return {
    getResidentNoPaging,
    removeResident,
    addResident,
    getResidentAgg,
    getResidentById,
    deleteResident,
    updateResident,
    checkIdExist,
    getCount,
    getResident
  }
}
