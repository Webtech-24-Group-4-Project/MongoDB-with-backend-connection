const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contacts: [{ type: String }], // Define the contacts field in Mongoose schema
});

const User = mongoose.model('User', userSchema);

module.exports = User;
