module.exports = (joi, mongoose, { joi2MongoSchema, schemas }) => {
  const residentJoi = joi.object({
    avatar: joi.string().allow(''),
    name: joi.string().required(),
    dob: joi.number().required(),
    gender: joi.number().valid(0, 1).required(),
    identityNumber: joi.string().required(),
    email: joi.string().required(),
    address: joi.string().required(),
    phone: joi.string().required()
  })
  const residentSchema = joi2MongoSchema(residentJoi, {}, {
    createdAt: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000)
    }
  })
  residentSchema.statics.validateObj = (obj, config = {}) => {
    return residentJoi.validate(obj, config)
  }
  residentSchema.statics.validateDocument = (obj, config = {
    allowUnknown: true,
    stripUnknown: true
  }) => {
    return residentJoi.validate(obj, config)
  }
  const residentModel = mongoose.model('LoaiHopDong', residentSchema)
  residentModel.syncIndexes()
  return residentModel
}
