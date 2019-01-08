// Dependencies
    // Server Setup
    var express = require("express");
    var exphbs = require("express-handlebars");
    // Status Logger (Middleware)
    var logger = require("morgan");
    // Database
    var mongoose = require("mongoose");

// Require Routes 
    require("./routes/routes");

// Local host Port
    var PORT = process.env.PORT || 4000;

// Initialize Express
    var app = express();

// Setting morgan logger for logging request
    app.use(logger('dev'));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

// Making public default static location
    app.use(express.static("public"));

// Handlebars
    app.engine("handlebars", exphbs ({ defaultLayout: "main"}));
    app.set("view engine", "handlebars");

// Connect to Mongo DB
    mongoose.connect('mongodb://localhost/mongo-scrapper', { useNewUrlParser: true });

// Starting Server
    app.listen(PORT, () => console.log("App running on port " + PORT + "!"));