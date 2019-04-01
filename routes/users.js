/**
 * Created by ishanarora on 31/03/19.
 */


var express = require('express');
var router = new express.Router();
var mysql = require('./mysqlLib');
var md5  = require('md5');
var Promise = require('bluebird');

router.post('/register', (req, res)=> {

        var username = req.body.username;
        var password = md5(req.body.password);
        var apiReference = {
                module: 'users',
                api: 'api'
        }
        return Promise.coroutine(function *() {

                var sql = ` INSERT INTO tb_users SET ? `
                return mysql.DBHandler(apiReference, `Creating new Users`, sql, [{
                        username: username,
                        password: password
                }]);
        })().then((data)=> {
                res.send({message: 'user Created'});
        }).catch((err)=> {
                res.send({err: err.message});
        })

});


router.post('/login', (req, res)=> {

        console.log(req.headers.host);

        var username = req.body.username;
        var password = md5(req.body.password);
        var apiReference = {
                module: 'users',
                api: 'api'
        }
        return Promise.coroutine(function *() {

                var sql = ` select * from tb_users where username = ? AND password = ? `
                var user = yield mysql.DBHandler(apiReference, `Creating new Users`, sql, [
                        username,
                        password
                ]);

                return user;

        })().then((data)=> {
                if (data.length > 0) {
                        res.send({message: 'Login Successful'});
                } else {
                        res.send({message: 'User Not found'});
                }
        }).catch((err)=> {
                res.send({err: err.message});
        })
});

module.exports = router;
