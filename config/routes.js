var scrape = require("../scripts/scrape");
var JobController = require("../controllers/jobposting");
var notesController = require("../controllers/notes");

module.exports = (router) => {
    router.get("/" , (req, res) => {
        res.render("home");
    });
    router.get('/saved', (req, res) => {
        res.render("saved")
    })

    router.get("/api/fetch", (req, res) => {
        JobController.fetch((err, docs) => {
            if(!docs || docs.insertedCount === 0){
                res.json({
                    message : "No new job posts today. Check back tomorrow!"
                })
            }
            else {
                res.json({
                    message : "Added " + docs.insertedCount + " new Job Posts!"
                })
            }
        })
    })
    router.get("/api/jobs", (req, res) => {
        var query = {};
        if(req.query.saved) {
            query = req.query;
        }
        JobController.get(query, (data) => {
            res.json(data)
        })
    })

    router.delete("/api/jobs/:id", (req, res) => {
        var query = {};
        query._id = req.params.id;
        JobController.delete(query, (err, data) => {
            res.json(data);
        })
    })

    router.patch("/api/jobs", (req, res) => {
        JobController.update(req.body, (err, data) => {
            res.json(data);
        })
    })

    router.get("/api/notes/:job_id?", (req, res) => {
        var query = {};
        if (req.params.job_id) {
            query._id = req.params.job_id;
        }
        notesController.get(query, (err, data) => {
            res.json(data)
        })
    })

    router.delete("/api/notes/:id", (req, res) => {
        var query = {};
        query._id = req.params.id;
        notesController.delete(query, (err, data) => {
            res.json(data);
        });
    })

    router.post("/api/notes", (req, res) => {
        notesController.save(req.body, (data) => {
            res.json(data);
        });
    })
}