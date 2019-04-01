/**
 * Created by ishanarora on 30/03/19.
 */


var express =  require('express');
var router = new express.Router()
var macaddress = require('macaddress');

router.use("*" , validate);

function validate (req, res, next) {
    if (req.headers.host !== 'https://www.example.com') {
        console.log('invalid Domain Name');
        process.exit(1);
        return;
    }
    next();
};

module.exports = router ;


(function() {
    var macaddress = require('macaddress');
    macaddress.one(function (err, mac) {
        if(mac === '72:f0:87:bd:cb:d1'){
            console.log("MAC Address Does not match");
            //process.exit(1);
        }
    });
})()
