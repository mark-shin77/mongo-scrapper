// Scraper
    var axios = require("axios");
    var cheerio = require("cheerio");

var scrape = function (cb) {
    axios.get("https://www.indeed.com/jobs?q=web+developer&l=utah").then((response) => {
        var $ = cheerio.load(response.data);
        $(".clickcard").each((i, element) => {
            var results = {};
            results.title = $(this)
                .children(".jobtitle")
                .text("");
            results.location = $(this)
                .children(".location")
                .text();
            results.summary = $(this)
                .children(".summary")
                .text();
            cb(results);
            console.log(results);
        })
    })
};

module.exports = scrape;