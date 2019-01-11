var express = require("express");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect Handlebars
app.engine("handlebars", exphbs ({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/indeedjobposts", { useNewUrlParser: true });

// Routes

app.get("/", function (req, res) {
  res.render("home");
})

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.indeed.com/jobs?q=web+developer&l=utah").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an Job tag, and do the following:
    $(".jobsearch-SerpJobCard").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children(".jobtitle")
        .text();
      result.location = $(this)
        .children(".sjcl")
        .children(".location")
        .text();
      result.summary = $(this)
        .children(".paddedSummary")
        .text();

      // Create a new Job using the `result` object built from scraping
      db.Job.create(result)
        .then(function(dbJob) {
          // View the added result in the console
          console.log(dbJob);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Jobs from the db
app.get("/jobs", function(req, res) {
  // Grab every document in the Jobs collection
  db.Job.find({})
    .then(function(dbJob) {
      // If we were able to successfully find Jobs, send them back to the client
      res.json(dbJob);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Job by id, populate it with it's note
app.get("/jobs/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Job.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbJob) {
      // If we were able to successfully find an Job with the given id, send it back to the client
      res.json(dbJob);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Job's associated Note
app.post("/jobs/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Job with an `_id` equal to `req.params.id`. Update the Job to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Job.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbJob) {
      // If we were able to successfully update an Job, send it back to the client
      res.json(dbJob);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
