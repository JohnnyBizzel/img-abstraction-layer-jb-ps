var express = require('express');
var router = express.Router();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var fs = require('fs');
var moment = require("moment");
var dotenv = require('dotenv');
dotenv.load();


function callAjax(url, callback){
    var xmlhttp;
    // compatible with IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            callback(xmlhttp.responseText);
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function updateRecentHistory(searched) {
    var content  = JSON.parse(fs.readFileSync('./history.json', 'utf8'));

    var updatedHistory = [];
   // updatedHistory.push(content);
    var nowDate = new Date();
    var obj = { 'term': searched, 'when': moment.utc(Date.now()).local()};
    updatedHistory = (content);
    updatedHistory.splice(0, 0, obj);
    updatedHistory.pop();
    
    fs.writeFile("history.json", JSON.stringify(updatedHistory), function(err) {
        if (err) {
                console.log(err);
                //throw err;
            }
    });
}

function url (term, query, pagelimit) {
    var apikey = process.env.FLICKR_KEY;
    var page = 1;
    
    if (query && query.page !== undefined) {
        page = query.page;
    }
    
    return 'https://api.flickr.com/services/rest/?method=flickr.photos.search&page='+
                page+'&per_page=' + pagelimit + '&api_key=' + 
                apikey + '&accuracy=1&tags=' +term+ '&sort=relevance&extras=url_l,url_sq&format=json';
}


/* GET users listing. */
router.get('/:term', function(req, res, next) {
    var pagelimit = 10;
    if (req.query && req.query.pagelimit !== undefined) {
        pagelimit = req.query.pagelimit;
    }
    callAjax(url(req.params.term, req.query, pagelimit), function(data){
        
        var obj = {};
        var resultArray = [];
        var json = eval( "(" + data.substr(13) + ")" );
        
        if (!json.photos.photo.length > 0) {
            console.log("No data");
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Sorry, no photos found.');
            return;
        } else if (json.photos.photo.length < pagelimit) 
            pagelimit = json.photos.photo.length;
            
        for (var i = 0; i < pagelimit; i++) {
            var jObj = json.photos.photo[i];
        
            obj.url = jObj['url_l'];
            obj.snippet = jObj['title'];
            obj.thumbnail = jObj['url_sq'];
            obj.context = 'http://www.flickr.com/photos/' + jObj['owner']+ '/'+jObj['id'];
            resultArray.push(Object.assign({}, obj));
        }
        updateRecentHistory(req.params.term);
        res.send(resultArray);
  
    })
    
});

router.get('/', function(req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('Now add a search term to the end of the URL in the address bar');

})

module.exports = router;