var express = require('express');
var router = express.Router();
var request = require("request");
var twitterOauth = require("../keys").twitter;
var dandelionKey = require("../keys").dandelion;

var tweetOptions = function (term) {
        return {
            method: 'GET',
            url: 'https://api.twitter.com/1.1/search/tweets.json',
            qs: {q: term, count: 10, lang: "eu",result_type: "mixed"},
            headers:
                {
                    'cache-control': 'no-cache',
                    authorization: twitterOauth
                }
        }
    }
;

var returnTweetOptions = function (id) {
    return { method: 'GET',
        url: 'https://publish.twitter.com/oembed',
        qs: { url: 'https://twitter.com/Interior/status/'+id , hide_media:true},
        headers:
        {
            'cache-control': 'no-cache' } }
};

var entitySearchOptions = function (text) {
    return {
        method: 'GET',
        url: 'https://api.dandelion.eu/datatxt/nex/v1/',
        qs:
            {
                text: text + '\n',
                include: 'types,abstract,categories',
                lang: "en",
                top_entities: 3,
                token: dandelionKey
            },
        headers:
            {
                'cache-control': 'no-cache'
            }
    }
};


router.get('/api/twitter_posts', function (req, res) {

    let term = req.query.term || "";
    request(entitySearchOptions(term), function (error, response, body) {
        if (error) throw new Error(error);

        body = JSON.parse(body);
        console.log(body.topEntities);
        let topEntity = body.annotations.find(function (element) {
            if (element.id === body.topEntities[0].id)
                return element.label;
        });
        if(topEntity)
        {
            request(tweetOptions(topEntity.label), function (error, response, body) {
                if (error) throw new Error(error);
                console.log("Returning tweets");
                console.log("Term:\t" + term + '\n');
                console.log(topEntity.label);
                body = JSON.parse(body);
                //console.log(body.statuses);
                let rawStatuses = body.statuses.concat([]);
                console.log(rawStatuses.length);
                if(!rawStatuses.length)
                {
                    res.json({error:"error"});
                    return;
                }
                let statuses=[];
                let numOfProcessedStatuses = 0;
                rawStatuses.forEach((element)=>{
                    request(returnTweetOptions(element["id_str"]), function (error, response, body) {
                        if (error) throw new Error(error);
                        numOfProcessedStatuses++;
                        statuses.push(body);
                        if(numOfProcessedStatuses=== rawStatuses.length)
                        {
                            let result = [];
                            statuses.forEach((statusString)=>
                            {
                                result.push(JSON.parse(statusString).html);
                            });
                            console.log(result);
                            res.json({keyword:topEntity.label,result:result});
                        }
                    });
                });
                //console.log(body);
            });

        }
        else {
            console.log("Error");
            res.json({error:"error"});
        }
    });

});

module.exports = router;




