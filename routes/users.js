var express = require('express');
var router = express.Router();
var passport = require('passport');
var libs = process.cwd() + '/src/';
var log = require(libs + 'log')(module);
var GoogleTokenStrategy = require('passport-google-id-token').Strategy;

var mysql = require('mysql');
var connection = mysql.createConnection({ // Mysql Connection
    host : 'localhost',
    user : 'root',
    password : 'helloworld',
    database : 'umap'
});
passport.use(new GoogleTokenStrategy({
      clientID: '221601576513-9gdgmghqm3mkss52ehl4fifv08tpo3v3.apps.googleusercontent.com'
      //,getGoogleCerts: customGetGoogleCerts
    }
    ,
    function(parsedToken, googleId, done) {
        log.debug("parsedToken  = ",parsedToken);
        var query = "SELECT * FROM ?? WHERE ??=?"
        // var query = "SELECT * FROM geo_point WHERE ??=?";
        var table = ["users","googleId",googleId];
        query = mysql.format(query,table);
        log.debug(" guides get id ",query);
        connection.query(query,function(err,rows){
            if(err) {
                log.debug(" guides get  error",err.message,query);
            } else {
                if(rows.length==0){
                    var query = "INSERT INTO users(??,??,??) VALUES (?,?,?)";
                    var table = ["googleId","name","email", googleId,parsedToken.name,parsedToken.email];
                    log.debug(" add token", googleId,parsedToken.data.name,parsedToken.data.email);
                    query = mysql.format(query,table);
                    connection.query(query,function(err){
                        if(err)
                            log.debug(" guides post error",err.message);

                    });
                }else{
                    log.debug(" rows  ",rows);

                    return done(err, rows);
                }

            }
        });


        //User.findOrCreate({ googleId: googleId }, function (err, user) {
        //return done(err, user);
      //});
    }
));
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//http://127.0.0.1:8080/users/auth/google?id_token=eyJhbGciOiJSUzI1NiIsImtpZCI6IjM3ZDg1ZjJmYjI4Mzc1YjYxNDhjNDZlNzRhMWFkM2IwMDMwYWMwN2EifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwic3ViIjoiMTA1MzQwNjQwNTA2NzAwMjM2ODYwIiwiYXpwIjoiMjIxNjAxNTc2NTEzLWlyYnBnZzFlNWtuN25pbm44aDVrajlxNTVoYnZiOGkzLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiZW1haWwiOiJzYXNoYWFuZHJlZXY3QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdWQiOiIyMjE2MDE1NzY1MTMtOWdkZ21naHFtM21rc3M1MmVobDRmaWZ2MDh0cG8zdjMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJpYXQiOjE0MzM5NjQ5MDksImV4cCI6MTQzMzk2ODUwOSwibmFtZSI6IlNhc2hhIEFuZHJlZXYiLCJnaXZlbl9uYW1lIjoiU2FzaGEiLCJmYW1pbHlfbmFtZSI6IkFuZHJlZXYifQ.VIVXs4zaGwSyKC_X8G98uaIlPR7Rfas98g1WveprpqQPFpOqcVuulyzVFxHC2C3e3yDRSE3sHIHb0dI06rD8dYkB-S1NYwWbMelJkzHv-MXQav1hOyf2AlWMqogHnU2nz-lnNVnv2bgPkLKYQSBOf4CuddshrFGQyQjrBlRrflY
router.get('/auth/google',
    passport.authenticate('google-id-token',{ session: false }),
    function (req, res) {
      // do something with req.user
      res.send(req.user? 200 : 401);
    }
);
module.exports = router;
