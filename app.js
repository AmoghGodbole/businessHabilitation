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

app.set("view engine", "ejs");

app.use(

require("express-session")({

secret: "Arnav is the best",

resave: false,

saveUninitialized: false,

})

);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use(passport.session());

passport.serializeUser(function (user, done) {

done(null, user);

});

passport.deserializeUser(function (user, done) {

if (user != null) done(null, user);

});

passport.use("customerLocal", new LocalStrategy(Customer.authenticate()));

passport.use("businessLocal", new LocalStrategy(Business.authenticate()));