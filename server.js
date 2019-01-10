// Dependencies
    // Server Setup
    var express = require("express");
    var exphbs = require("express-handlebars");
    var bodyParser = require("body-parser");
    // Database
    var mongoose = require("mongoose");

// Local host Port
    var PORT = process.env.PORT || 4000;

// Initialize Express
    var app = express();

// Set up an Express Router
    var router = express.Router();
    require("./config/routes")(router);

// Making public default static location
    app.use(express.static(__dirname + "/public"));
    
// Connect Handlebars
    app.engine("handlebars", exphbs ({ defaultLayout: "main"}));
    app.set("view engine", "handlebars");

// Adding bodyParser into our app
    app.use(bodyParser.urlencoded({ extended: false }));

// Have every req go through router middleware
    app.use(router);

// Have app go through online db if deployed, if not go through localhost
    var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Connect to Mongo DB
    mongoose.connect(db, { useNewUrlParser: true }, (error) => {
        if (error){
            console.log(error);
        }
        else {
            console.log("mongoose has successfully connected")
        }
    })

// Starting Server
    app.listen(PORT, () => console.log("App running on port " + PORT + "!"));