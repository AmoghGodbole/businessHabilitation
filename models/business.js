const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const BusinessSchema = new mongoose.Schema({
  username: String,
  password: String,
  type: String,
  location: String,
  domains: [
    {
      type: String,
    },
  ],
  businessName: String,
  // CUSTOMER ID ALSO NEEDS TO BE PASSED IN TO ENQUIRIES.
  // THE SHOP OWNER CAN THEN ACCEPT OR REJECT THE ENQUIRY
  // THE CUSTOMER WILL BE DULY NOTIFIED ABOUT THE ACCEPTANCE OR REJECTION
  enquiries: [
    {
      enquiry: String,
      customerId: String,
    },
  ],
});

BusinessSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Business", BusinessSchema);
