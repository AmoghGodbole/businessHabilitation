const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const CustomerSchema = new mongoose.Schema({
  username: String,
  password: String,
  type: String,
  location: String,
  fullName: String,
});

CustomerSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Customer", CustomerSchema);
