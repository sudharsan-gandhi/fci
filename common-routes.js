const express = require('express');
const router = express.Router();
const common = require("./common");

router.get('/api',function(req,res){
    res.json({success: 'success'});
})
router.post('/token',function(req,res){
    var token = common.createToken({id: 1, role: 'miller'});
    res.json({token: token});
})

module.exports = router;