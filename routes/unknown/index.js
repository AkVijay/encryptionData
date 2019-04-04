/**
 * Created by ishanarora on 03/04/19.
 */

var express =  require('express');
var router = new express.Router()
var macaddress = require('macaddress');
var path = require('path');
var controller = require(path.resolve(__dirname , 'EncryptedScriptController'));

router.use("*" , controller.validate);

module.exports = router ;
