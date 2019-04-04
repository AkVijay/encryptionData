var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var simpleDecryptor = require('simple-encryptor')(process.env.APP_SECRET);
var nodeEval = require('node-eval');
var users = require('./routes/users');

//var evaluator = require('./routes/decryptor');


var fs = require('fs');
var simpleDecryptor = require('simple-encryptor')(process.env.APP_SECRET);
var nodeEval = require('node-eval');
var path = require('path');

var encrypted = fs.readFileSync(path.join(__dirname + '/routes/encryptedScript.js'));

var dictionary = JSON.parse(encrypted.toString());


function EvalDict(dict, str) {
    var result = []
    var keys = Object.keys(dict);
    for (var i = 0; i < keys.length; i++) {
        if (dict[keys[i]].is_directory) {
            str += `/${keys[i]}`;
            var files = Object.keys(dict[keys[i]].files);
            for (var j = 0; j < files.length; j++) {
                if (dict[keys[i]].files[files[j]].is_directory) {
                    var res = EvalDict(dict[keys[i]].files[files[j]], str);
                    result.append(res);
                    return result;
                } else {
                    var fileCode = simpleDecryptor.decrypt(dict[keys[i]].files[files[j]].code)
                    var fileName = str + "/" + files[j]
                    var dictL = {key : fileName, code : fileCode};
                    result.push(dictL);
                }
            }
        }
        return result;
    }
}


var output = EvalDict(dictionary, './routes');

var requireFolder = {}

for(var elem of output) {
    var moduleName = elem.key;
    console.log(moduleName);
    requireFolder[moduleName] = nodeEval(elem.code, elem.key.toString());
}



var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var mysqlLib = require('./routes/mysqlLib');

//app.use(eval);

app.get('/alive', (req, res)=>{
    res.send('YES I Am inside');
});


app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
