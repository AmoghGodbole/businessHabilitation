const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const LocalStrategy = require("passport-local");
const Customer = require("./models/customer");
const Business = require("./models/business");
const { seed, enquiries, locations } = require("./seedData");
const { findByIdAndUpdate } = require("./models/customer");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect(
  "mongodb+srv://Amogh:m9wrlhTjJLaO0CWX@cluster0.diaql.mongodb.net/testDB?retryWrites=true&w=majority",
  () => {
    console.log("DB Connected!");
  }
);

app.set("view engine", "ejs");
app.use(
  require("express-session")({
    secret: "Arnav is the best",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  if (user != null) done(null, user);
});
passport.use("customerLocal", new LocalStrategy(Customer.authenticate()));
passport.use("businessLocal", new LocalStrategy(Business.authenticate()));

//==========
//ROUTES
//==========

app.get("/", function (req, res) {
  res.render("home");
});

//Auth Routes

//Show signUp form
app.get("/register/customer", function (req, res) {
  res.render("customer/register", { locations });
});

//Handling User Sign up
app.post("/register/customer", function (req, res) {
  Customer.register(
    new Customer({
      username: req.body.username,
      location: req.body.location,
      type: "customer",
    }),
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.render("customer/register");
      } else {
        passport.authenticate("customerLocal")(req, res, () => {
          res.redirect("/customer/list");
        });
      }
    }
  );
});

//Login Routes(Show login form)
app.get("/login/customer", function (req, res) {
  res.render("customer/login");
});

//Login logic
app.post(
  "/login/customer",
  passport.authenticate("customerLocal", {
    successRedirect: "/secret",
    failureRedirect: "/login/customer",
  }),
  function (req, res) {}
);

//Log Out Route
app.get("/logout/customer", function (req, res) {
  req.logout(); //One line all thanks to passport
  res.redirect("/");
});

// BUSINESS ROUTES
//Show signUp form
app.get("/register/business", function (req, res) {
  res.render("business/register", { locations });
});

//Handling User Sign up
app.post("/register/business", function (req, res) {
  console.log("request body: ", req.body);
  Business.register(
    new Business({
      username: req.body.username,
      type: "business",
      location: req.body.location,
      businessName: req.body.businessName,
      domains: req.body.domains,
    }),
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.render("business/register");
      } else {
        passport.authenticate("businessLocal")(req, res, function () {
          res.redirect("/customer/list");
        });
      }
    }
  );
});

//Login Routes(Show login form)
app.get("/login/business", function (req, res) {
  res.render("business/login");
});

//Login logic
app.post(
  "/login/business",
  passport.authenticate("businessLocal", {
    successRedirect: "/secret",
    failureRedirect: "/login/business",
  }),
  function (req, res) {}
);

//Log Out Route
app.get("/logout/business", function (req, res) {
  req.logout(); //One line all thanks to passport
  res.redirect("/");
});

function isCustomerLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("req user: ", req.user);
    return next();
  }
  console.log("Nope");
  res.redirect("/login/customer");
}

// PAGE WHERE CUSTOMER SEES A LIST OF ITEMS
app.get("/customer/list", isCustomerLoggedIn, async (req, res) => {
  const result = await Business.find({});
  res.render("businessList", { shops: result });
});

app.post("/business/:id/enquire", async (req, res) => {
  console.log("req params id: ", req.params.id);
  const { enquiry } = req.body;
  const newEnquriy = {
    enquiry,
    customerId: req.user.id,
  };
  let result = await Business.findById(req.params.id);
  result.enquiries.push(newEnquriy);
  await result.save();
  console.log("Result: ", result);
});

// GET ALL THE ENQUIRIES FOR A PARTICULAR BUSINESS
app.get("/business/enquiries", (req, res) => {
  res.render("enquiryList", { enquiries });
});

app.listen(3000, function () {
  console.log("Server has started");
});
