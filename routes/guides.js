/**
 * Created by sasha on 08.06.15.
 */
var express = require('express');
var router = express.Router();
var libs = process.cwd() + '/src/';
var mysql = require('mysql');

var log = require(libs + 'log')(module);
var connection = mysql.createConnection({ // Mysql Connection
    host : 'localhost',
    user : 'root',
    password : 'helloworld',
    database : 'umap'
});


router.get('/',function(req,res){
    connection.query("SELECT * from guides",function(err, rows, fields){
        if(err){
            res.json(rows);
            log.debug(" guides all error",err.message);
        }else{
            res.json(rows);
        }
    });
});

router.post('/', function(req, res) {
    var query = "INSERT INTO guides(??,??,??,??,??,??,??,??,??,??,??) VALUES (??,??,??,??,??,??,??,??,??,??,??)";
    var table = ["changed","dataCash","description","fullImgUrl","imgUrl","latitude","locale","longitude","mapCash","name","rating",
                req.body.dataCash,req.body.description,req.body.fullImgUrl,req.body.imgUrl,req.body.latitude,req.body.locale,req.body.longitude,req.body.mapCash,req.body.name,req.body.rating];
    query = mysql.format(query,table);
    connection.query(query,function(err,rows){
        if(err) {
            log.debug(" guides post error",err.message);
        } else {
            res.json({"Error" : false, "Message" : "User Added !"});
        }
    });
});

router.get('/:id', function(req, res) {
    var query = "SELECT * FROM guides WHERE ??=?";
    var table = ["guide_id",req.params.id];
    query = mysql.format(query,table);
    log.debug(" guides get id ",query);
    connection.query(query,function(err,rows){
        if(err) {
            log.debug(" guides get id error",err.message,query);
        } else {
            res.json(rows);
        }
    });
});

router.put('/:id', function (req, res){
    var query = "UPDATE guides SET ??,??,??,??,??,??,??,??,??,??,??,?? = ? ? ? ? ? ? ? ? ? ? ? ? WHERE ?? = ?";
    var table = ["changed","dataCash","description","fullImgUrl","imgUrl","latitude","locale","longitude","mapCash","name","rating","guide_id",
        req.body.dataCash,req.body.description,req.body.fullImgUrl,req.body.imgUrl,req.body.latitude,req.body.locale,req.body.longitude,req.body.mapCash,req.body.name,req.body.rating
    ,req.body.id];
    query = mysql.format(query,table);
    connection.query(query,function(err,rows){
        if(err) {
            res.json({"Error" : true, "Message" : "Error executing MySQL query"});
        } else {
            res.json({"Error" : false, "Message" : "Updated the password for email "+req.body.email});
        }
    });
});


router.delete('/:id', function (req, res){
    var query = "DELETE from guides WHERE ??=?";
    var table = ["guide_id",req.params.id];
    query = mysql.format(query,table);
    connection.query(query,function(err,rows){
        if(err) {
            log.debug(" guides delete id error",err.message,query);
        } else {
            res.json({"Error" : false, "Message" : "Deleted the user with email "+req.params.email});
        }
    });
});


module.exports = router;
