/**
 * Created by ishanarora on 19/03/19.
 */
var mysql = require('mysql');
var moment = require('moment');

var db_config = {
    host: '139.59.72.119',
    user: 'vijay3',
    password: 'iaJan2017!',
    database: 'freelancer',
    multipleStatements: true
};


var numConnectionsInPool = 0;
function initializeConnectionPool(db_config){
    console.log('CALLING INITIALIZE POOL');
    var conn = mysql.createPool(db_config);
    conn.on('connection', function (connection) {
        numConnectionsInPool++;
        console.log('NUMBER OF CONNECTION IN POOL : ', numConnectionsInPool);
    });
    return conn;
}

connection = initializeConnectionPool(db_config);
var dbClient = {
    executeQuery : function(queryObject, callback, apiReference){
        var sql = connection.query(queryObject.query, queryObject.args, function(err, result){
            var event = queryObject.event || "Executing mysql query";
            if(!apiReference){
                apiReference = {
                    module: "mysqlLib",
                    api: "executeQuery"
                }
            }
            if(err){
                logSqlError(apiReference, event, err, result, sql);
                if(err.code === 'ER_LOCK_DEADLOCK' || err.code === 'ER_QUERY_INTERRUPTED'){
                    setTimeout(module.exports.dbHandler.executeQuery.bind(null, queryObject, callback, apiReference), 50);
                } else{
                    callback(err, result, sql);
                }
            } else{
                callback(err, result, sql);
            }
        });
    }

};

exports.dbHandler = (function (){
    return dbClient;
})();

//console.log("db config is - ",db_config);
//slaveConnection = initializeConnectionPool(slave_db_config);

function logSqlError(apiReference, event, err, result, sql){
    if(!sql){
        sql = {};
    }
    var log = {EVENT : event, ERROR : err, RESULT : result, QUERY : sql.sql};
    try {
        log = JSON.stringify(log);
    }
    catch(exception) {}
    console.error("--> Error in sql query " + moment(new Date()).format('YYYY-MM-DD hh:mm:ss.SSS') + " :----: " +
        apiReference.module + " :=: " + apiReference.api + " :=: " + log);

}

var dbClientPromisified = {
    executeQuery : function (apiReference, event, queryString, params) {
        return new Promise((resolve, reject) => {
            var query = connection.query(queryString, params, function (error, result) {
                console.log(apiReference, {EVENT: "Executing query " + event, QUERY: query.sql, ERROR: error,
                RESULT: result});
                if(error){
                    console.log("*************",error,this.sql)
                    if(error.code === 'ER_LOCK_DEADLOCK' || error.code === 'ER_QUERY_INTERRUPTED'){
                        return setTimeout(function () {
                            module.exports.dbHandlerPromisified.executeQuery(apiReference, event, queryString, params);
                        }, 50);
                    }
                    return reject(error);
                }
                return resolve (result);
            });
        });
    }
}
exports.dbHandlerPromisified = (function (){
    return dbClientPromisified ;
})();

exports.updateMysqlTable = function (apiReference, event, tableName, newdata, condition, queryEnding) {
    return new Promise((resolve, reject) => {
            var sql = "UPDATE ?? SET ? WHERE ";
    var sqlParams = [tableName, newdata];
    for (var key in condition) {
        sql += key + " = ? AND ";
        sqlParams.push(condition[key]);
    }
    sql = sql.slice(0, -4) + " " + (queryEnding || "");

    var query = connection.query(sql, sqlParams, function (sqlError, sqlResult) {
        // console.log("query------------",query.sql)
        logging.log(apiReference, {EVENT: "Update query " + event, QUERY: query.sql, SQL_RESULT: sqlResult});

        if (sqlError || !sqlResult) {
            logging.logError(apiReference, {EVENT: "Error in update query " + event, QUERY: query.sql,
                SQL_ERROR: sqlError});
            return reject (sqlError);
        }
        return resolve (sqlResult);
    });
});
};


exports.DBHandler = (apiReference,event, stmt, args )=> {
    return dbClientPromisified.executeQuery(apiReference,event, stmt, args);
}
