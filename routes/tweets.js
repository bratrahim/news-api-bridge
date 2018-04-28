var express = require('express');
var router = express.Router();
var request = require("request");

var tweetOptions = function (term) {
        return {
            method: 'GET',
            url: 'https://api.twitter.com/1.1/search/tweets.json',
            qs: {q: term, count:10},
            headers:
                {
                    'cache-control': 'no-cache',
                    'authorization': ''
                }
        }
    }
;

router.get('/api/twitter_posts', function (req, res) {

    let term = req.query.term || "";
    request(tweetOptions(term), function (error, response, body) {
        if (error) throw new Error(error);
        console.log("Returning tweets");
        console.log("Term:\t" + term + '\n');
        res.json(body);
    });
});

module.exports = router;