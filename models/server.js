const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const serverSchema = new Schema({
  prefix: String,
  logchannel: String,
  roleafterver: String,
  serverid: String,
  adminRole: String,
  modRole: String,
  verification: Boolean,
  logging: Boolean,  
  loopsongs: Boolean
})

module.exports = mongoose.model('Server', serverSchema)