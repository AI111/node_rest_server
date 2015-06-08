/**
 * Created by salterok on 08.06.2015.
 */

var mysql = require('mysql');
var pool;

var CONNECTION_LIMIT = 10;

var db = {};
db.init = function(cb) {
    pool = mysql.createPool({
        connectionLimit : CONNECTION_LIMIT,
        host : 'localhost',
        user : 'root',
        password : 'helloworld',
        database : 'umap'
    });

    pool.on('connection', function (connection) {
        console.log('new connection to sphinx created')
    });
    pool.on('enqueue', function () {
        console.log('waiting for available connection')
    });

    return cb();
};

db.connection = pool;

module.exports = db;