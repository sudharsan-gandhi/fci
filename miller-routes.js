const express = require('express');
const router = express.Router();
const config = require("./config");
const common = require("./common");

router.use(function authenticate(req, res, next) {
    common.authenticateMiller(req,res,next)
    next();
});

router.get('/api',function(req,res){
    console.log(req.user.id);
    res.json("msg");
});

module.exports = router;