const express = require('express');
const router = express.Router();
const common = require("./common");
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
    db.get(dbName, req.body._id).then(({data, headers, status}) => {
            console.log( "pouch "+ JSON.stringify(req.body));
            req.body._rev = data._rev

            if(data.timestamp < req.body.timestamp){
                db.update(dbName,req.body)
                .then(({data, headers, status}) => {
                    res.json({success_msg: 'successfully Update up'});
                })
                .catch(err => {
                    console.log("error:", err);
                    res.status(400).send({ error_msg: err+" Update error" });
                });
        }
        else if(data.timestamp > req.body.timestamp){
            res.json(data)
        }
        else{
            res.json({ms: "Already up to date"})
        }


        console.log("couch "+data._rev+" pouch "+ req.body._rev);
        // res.json(data);
    }, err => {
        // either request error occured
        // ...or err.code=EDOCMISSING if document is missing
        // ...or err.code=EUNKNOWN if statusCode is unexpected
        db.insert(dbName,req.body)
                .then(({data, headers, status}) => {
                    res.json({success_msg: 'successfully Inserted up'});
                })
                .catch(err => {
                    console.log("error:", err);
                    res.status(400).send({ error_msg: err+" New Req error" });
                });
    });
})
module.exports = router;