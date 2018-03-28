//import { db, dbName } from './database';
const	dbConfig		= 	require('./database');
const 	db 				= 	dbConfig.db;
const 	dbName			= 	dbConfig.dbName;
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

router.get('/getAll',function(req,res){
    id = req.user._id;
    console.log(id);
    db.get(dbName, req.user._id).then(({data}) => {
        console.log(data);
        res.status(200).send({'miller': data});
    }, err => {
        res.json({'error_msg': err});
    });
    // http.get("localhost:5984/fci/id")
    // .then((data) => res.json('docs: ', data)
    // ).catch((err)=> {
    //     res.json("error bulkdocs:", err);
    // })
    // res.json({msg: "error"});
})

module.exports = router;