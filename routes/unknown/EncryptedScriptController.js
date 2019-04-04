/**
 * Created by ishanarora on 03/04/19.
 */


exports.validate = validate;

function validate(req, res, next){

  if (req.headers.host !== 'localhost:3000') {
        console.log('invalid Domain Name');
        process.exit(1);
        return;
    }
    next();

}

(function() {
    var macaddress = require('macaddress');
    macaddress.one(function (err, mac) {
        if(mac !== '72:f0:87:bd:cb:d1'){
            console.log("MAC Address Does not match");
            process.exit(1);
        }
    });
})()
