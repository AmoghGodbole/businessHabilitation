const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const CustomerSchema = new mongoose.Schema({
  username: String,
  password: String,
  type: String,
  location: String,
  fullName: String,
  enquiries: [
    {
      // id: String,
      enquiry: String,
      customerId: String,
      customerName: String,
      location: String,
      status: Boolean,
      checked: Boolean
    },
  ],
});

CustomerSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Customer", CustomerSchema);
