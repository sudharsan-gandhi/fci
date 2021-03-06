const NodeCouchDb 	= 	require('node-couchdb'),
dbName			=   'fci';
const config = require('./config');
const jwt = require("jsonwebtoken");
function bearerToken(req,res) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        return bearerToken;
      } else {
        return null;
      }
}

module.exports.authenticateMiller = function(req,res,next) {
    var token =bearerToken(req,res);
    if(token==null) {
        res.send(403)
        res.end();
    }else{
        jwt.verify(token,config.secretkey,function(err,data){
            if (err) {
                res.status(403).send("forbidden");
            }else{
                console.log("msggggg:",data);
                if(data.role == 'miller'){
                    req.user = data;
                }else {
                    res.status(401).send("unauthorized");
                }
            }
            
        })
    }
};

module.exports.authenticateManager = function(req,res,next) {
    var token =bearerToken(req,res);
    if(token==null) res.sendStatus(403);
    jwt.verify(token,config.secretkey,function(err,data){
        if (err) {
            res.sendStatus(403);
          }
        if(data.role == 'manager'){
            req.user = data;
        }else res.sendStatus(401);
        
    })
    next();
};

module.exports.authenticate = function(req,res,next) {
    var token =bearerToken(req,res);
    if(token==null) res.sendStatus(403);
    decode = jwt.verify(token,config.secretkey,function(err,data){
        if (err) {
            res.sendStatus(403);
          }else {
              console.log("msg:",data);
            req.user = data;
          }
    })
    console.log("msgggg:  ",decode)
    next();
};

module.exports.createToken = function(user){
    const token = jwt.sign({_id:user._id,role: user.role},config.secretkey);
    return token;
}

