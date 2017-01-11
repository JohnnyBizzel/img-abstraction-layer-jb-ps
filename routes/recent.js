var express = require('express');
var router = express.Router();
var fs = require("fs");

/* GET home page. */
router.get('/', function(req, res, next) {
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

});

module.exports = router;