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
    if(token==null) res.send(403);
    jwt.verify(token,config.secretkey,function(err,data){
        if (err) {
            res.sendStatus(403);
          }
        if(data.role == 'miller'){
            req.user = data;
        }else res.sendStatus(401);
        
    })
    next();
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

module.exports.createToken = function(user){
    const token = jwt.sign({id:user.id,role: user.role},config.secretkey);
    return token;
}