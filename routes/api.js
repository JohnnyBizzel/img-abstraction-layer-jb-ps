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

function readHistory(res) {
    var content;
    // First I want to read the file
    fs.readFile('./history.json', 'UTF-8',  function read(err, data) {
        if (err) {
            console.log(err);
            //throw err;
        }
        // Invoke the next step 
        processFile(data);         
    });
    
    function processFile(fileContent) {
        
        res.send(fileContent);
    }
}

function updateRecentHistory(searched) {
    console.log('upd hist: ' + searched);
    var content  = JSON.parse(fs.readFileSync('./history.json', 'utf8'));
    // First I want to read the file
    // fs.readFileSync('./history.json', 'utf8',  function read(err, data) {
    //     if (err) {
    //         console.log(err);
    //         //throw err;
    //     }
    //     content = JSON.parse(data);
    //     // Invoke the next step 
    //     console.log(content);
        
    // });
    
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
    	console.log("File Created @ " + Date.now());
    
    });
}


// Read local history file
router.get('/recent', function(req, res, next) {
    // TODO Catch error
    console.log('reading');
    var content;
    // First I want to read the file
    fs.readFile('./history.json', 'UTF-8',  function read(err, data) {
        if (err) {
            console.log(err);
            //throw err;
        }
        content = data;
        // Invoke the next step 
        processFile(content);         
    });
    
    function processFile(fileContent) {
        
        res.send(fileContent);
    }

})


/* GET users listing. */
router.get('/:term', function(req, res, next) {
    
    var searchTerm = req.params.term;
    
    var apikey = process.env.FLICKR_KEY;
    var pagelimit = 10;
    var query = req.query;
    var page = 1;
    if (req.query && req.query.page !== undefined) {
        page = req.query.page;
    }

    if (req.query && req.query.pagelimit !== undefined) {
        pagelimit = req.query.pagelimit;
    }
    
    var url= 'https://api.flickr.com/services/rest/?method=flickr.photos.search&page='+page+'&per_page=' + pagelimit + '&api_key=' + apikey + '&accuracy=1&tags=' +searchTerm+ '&sort=relevance&extras=url_l,url_sq&format=json';
    
    var obj = {
        snippet: "",
        url: "",
        context: "",
        thumbnail: ""
    };
    var resultArray = [];
    
    callAjax(url, function(data){
        
        
        var json = eval( "(" + data.substr(13) + ")" );
        console.log(JSON.stringify(json).substr(0, 400)); 
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
        updateRecentHistory(searchTerm);
        res.send(resultArray);
        // res.send(json.photos.photo[0]['title']);
        
    })
    
});

router.get('/', function(req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('Now add a search term to the end of the URL in the address bar');

})

module.exports = router;
