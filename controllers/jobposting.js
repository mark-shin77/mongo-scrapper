var scrape = require("../scripts/scrape");
var makeDate = require("../scripts/date");

var Job = require("../models/JobPosting");

module.exports = {
    fetch: (cb) => {
        scrape((data) => {
            var jobPosts = data;
            for (var x = 0; x < jobPosts.length; x++){
                jobPosts[i].date = makeDate();
                jobPosts[i].saved = false;
            }
            Job.collection.insertMany(jobPosts, {ordered: false}, (err, docs) =>{
                cb (err, docs);
            });
        });
    },
    delete: (query, cb) => {
        Job.remove(query, cb);
    },
    get: (query, cb) => {
        Job.find(query).sort({_id: -1}).exec((err, doc) => {
            cb(doc)
        });
    },
    update: (query, cb) => {
        Job.update({_id: query.id}, {
            $set: query
        }, {}, cb);
    }
}