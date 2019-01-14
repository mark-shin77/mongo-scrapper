// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("../models");
    
// Routes
module.exports = app => {
    // A GET route for scraping the indeed website for web dev jobs in utah
    app.get("/scrape", function(req, res) {
        axios.get("https://www.indeed.com/jobs?q=web+developer&l=utah").then(function(response) {
        var $ = cheerio.load(response.data);
    
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
                    console.log(dbJob);
            })
                .catch(function(err) {
                    console.log(err);
            });
        });
    
        // Send a message to the client
        res.redirect("/");
        });
    });

    // Home Page
    app.get("/", function (req, res) {
        db.Job.find({"saved": false}, function(err, data){
        let hbsObject = {
            job: data
        }
        res.render("home", hbsObject);
        })
    })

    // Route for grabbing a specific Job by id, populate it with it's note
    app.get("/jobs/:id", function(req, res) {
        db.Job.findOne({ _id: req.params.id })
        .populate("note")
        .then(function(dbJob) {
            res.json(dbJob);
        })
        .catch(function(err) {
            res.json(err);
        });
    });
    
    // Saved Jobs Page
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
    
    // Save Jobs Button Route
    app.post("/jobs/save/:id", function(req, res){
        db.Job.findOneAndUpdate({"_id": req.params.id }, { "saved": true }).exec(function(err, doc){
        if (err) {
            console.log(err)
        } else {
            res.send(doc)
        }
        })
    })
    
    // Remove Saved Button Route
    app.post("/jobs/delete/:id", function(req, res){
        db.Job.findOneAndUpdate({"_id": req.params.id }, { "saved": false }).exec(function(err, doc){
        if (err) {
            console.log(err)
        } else {
            res.send(doc)
        }
        })
    })
    
    // Remove All Scraped Jobs Button Route
    app.get("/clear", function (req, res) {
        db.Job.deleteMany({"saved": false}, function(err, data){
        res.redirect("/");
        })
    })
    
    // Route to look at all notes in db
    app.get("/saved/notes", function(req, res) {
        db.Note.find({})
        .then(function(dbNotes) {
            res.json(dbNotes);
        })
        .catch(function(err) {
            res.json(err);
        });
    });
    
    // Route to add note to a specific job
    app.post("/jobs/:id", function(req, res) {
        // Create a new note and pass the req.body to the entry
        db.Note.create(req.body)
            .then(function(dbNote) {
                return db.Job.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id }}, { new: true });
            })
            .catch(function(err) {
                res.json(err);
            });
    });
}