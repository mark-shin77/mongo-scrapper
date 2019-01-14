// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("../models");
    
// Routes
module.exports = app => {
    app.get("/", function (req, res) {
        db.Job.find({"saved": false}, function(err, data){
        let hbsObject = {
            job: data
        }
        res.render("home", hbsObject);
        })
    })
    
    app.get("/saved", function (req, res) {
        db.Job.find({"saved": true})
            .populate("note")
            .then(function(dbJobs){
                dbJobs = {job: dbJobs}
                res.render("saved", dbJobs);
            })
            .catch(function(err){
                console.log(err);
            })
    })
    
    app.post("/jobs/save/:id", function(req, res){
        db.Job.findOneAndUpdate({"_id": req.params.id }, { "saved": true }).exec(function(err, doc){
        if (err) {
            console.log(err)
        } else {
            res.send(doc)
        }
        })
    })
    
    app.post("/jobs/delete/:id", function(req, res){
        db.Job.findOneAndUpdate({"_id": req.params.id }, { "saved": false }).exec(function(err, doc){
        if (err) {
            console.log(err)
        } else {
            res.send(doc)
        }
        })
    })
    
    app.get("/clear", function (req, res) {
        db.Job.deleteMany({"saved": false}, function(err, data){
        res.redirect("/");
        })
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
            result.link = $(this)
            .children(".jobtitle")
            .attr("href");
            result.location = $(this)
            .children(".sjcl")
            .children(".location")
            .text();
            result.salary = $(this)
            .children(".paddedSummary")
            .children("table")
            .children("tbody")
            .children("tr")
            .children(".snip")
            .children(".salarySnippet")
            .text();
            result.summary = $(this)
            .children(".paddedSummary")
            .children("table")
            .children("tbody")
            .children("tr")
            .children(".snip")
            .children(".summary")
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
        res.redirect("/");
        });
    });
    
    // Route for getting all Jobs from the db
    app.get("/saved/notes", function(req, res) {
        // Grab every document in the Jobs collection
        db.Note.find({})
        .then(function(dbNotes) {
            // If we were able to successfully find Jobs, send them back to the client
            res.json(dbNotes);
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
                return db.Job.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id }}, { new: true });
            })
            .catch(function(err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });
}