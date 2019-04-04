/**
 * Created by ishanarora on 30/03/19.
 */



const simpleencrypter =  require('simple-encryptor')(process.env.APP_SECRET);
const fs  = require('fs');
const path = require('path');


var walk = function(dir, dirname, done) {
    var results = {is_directory: 1};
    fs.readdir(dir, function (err, list) {
        if (err) return done(err);
        var i = 0;
        (function next() {
            var file = list[i++];
            if (!file) return done(null, results);
            var file2 = dir + '/' + file;
            fs.stat(file2, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file2, file, function (err, res) {
                        results[file] = res;
                        next();
                    });
                } else {
                    var data = fs.readFileSync(file2);
                    if (!results.files) {
                        results.files = {}
                    }
                    results.files[file] = {is_directory: 0, code: simpleencrypter.encrypt(data.toString())}
                    next();
                }
            });
        })();
    });
};


walk(__dirname + `/dirname`, 'dirname', function(err, data) {
    var output = {};
    output['dirname'] = data;

    fs.writeFile('./routes/encryptedScript.js', JSON.stringify(output), function (err, data){
        console.log(data);
    });
});

