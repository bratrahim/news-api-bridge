var express = require('express');
var router = express.Router();
var request = require("request");
var apikey = require("../keys").newsapi;

var articlesOptions = function (query, region, category, page) {
    return {
        method: 'GET',
        url: 'https://newsapi.org/v2/top-headlines',
        qs:
            {
                q: query,
                country: region,
                pageSize: '10',
                category: category,
                page: page,
                apiKey: apikey
            },
        headers:
            {
                'cache-control': 'no-cache'
            }
    }
};

router.get('/api/articles', function (req, res) {
    let query = req.query.query || "";
    let region = req.query.region || "us";
    let category = req.query.category || "sports";
    let page = req.query.page || "1";

    request(articlesOptions(query,region,category, page), function (error, response, body) {
        if (error) throw new Error(error);
        console.log("Returning articles");
        console.log("Query:\t" + query+ '\n');
        console.log("Region:\t" + region + '\n');
        console.log("Category:\t" + category+ '\n');
        console.log("Page:\t" + page + '\n');
        if(body===undefined)
            res.status(500).send("fail");
        res.json(body);
    });
});


module.exports = router;