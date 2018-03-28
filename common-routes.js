const express = require('express');
const router = express.Router();
const common = require("./common");
const http = require("axios");
const	dbConfig		= 	require('./database');
const 	db 				= 	dbConfig.db;
const 	dbName			= 	dbConfig.dbName;

router.get('/api',function(req,res){
    res.json({success: 'success'});
})

router.post('/token',function(req,res){
    var token = common.createToken({id: 1, role: 'miller'});
    res.json({token: token});
})

router.post('/sync',function(req,res){
    console.log('request:',req.body);
    http.post("localhost:5984/fci/_bulk_docs",req.body)
    .then((data) => res.json('sucess bulkdocs:', data)
    ).catch((err)=> {
        res.json("error bulkdocs:", err);
    })
   
})
module.exports = router;