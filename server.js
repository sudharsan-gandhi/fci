const 	express			=	require('express'),
		app				=	express(),
		session			=	require('express-session'),
		parser 			=	require('body-parser'),
		statusMonitor 	= 	require('express-status-monitor')(),
		NodeCouchDb 	= 	require('node-couchdb'),
		dbName			=   'fci',		
		bcrypt			=	require('bcrypt'),
		port			=	'8000';//change the port to ur wish but dnt commit this change.
const 	db 				= 	new NodeCouchDb();
const common = require("./common");
const jwt = require("jsonwebtoken");
const commonRoutes = require("./common-routes");
const millerRoutes = require("./miller-routes");
const managerRouter = require("./manager-routes");
/*
//change mockdata file to any json file you want to create mock in db
let mockdata = './mockdata/transport_users.json' 
var documents = require(mockdata);
documents.forEach(function(document){
	db.insert(dbName,document)
		.then(({data, headers, status}) => {
	    	console.log("added:",data.name);
		}, err => {
		    console.log("error:",err);
		});
})
*/
//CORS handler
	app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
	});
//status monitor
	app.use(statusMonitor);
//session declaration
	app.use(session({
		secret:"quiz",
		resave:false,
		saveUninitialized:true,
		cookie:{
			secure:true,
			maxage:60000
			}
	}));
//Static files handler
	app.use(parser.json());
	//app.get('/status', {} , statusMonitor.pageRoute)
	//app.use('/{any_route_name}',express.static(_dirname='./{dir_name}'));
//request handler

/*
	app.get('/',function(req,res){
		res.sendFile('./app/view/index.html',{root:__dirname});
	});
*/
////////////////////////////////////////////////////////CODE ONLY HERE OR IMPORT CODE WITH IN THIS SCOPE////////////////////////////////////
app.use('/',commonRoutes);
app.use('/miller',millerRoutes);
 	app.post('/signup',function(req,res){
		 console.log('request:',req.body);
		 bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(req.body.password,salt, function(err, hash) {
				if(err) res.status(401).send({error_msg:err});
				req.body.password = hash;
				console.log('after hashed:', req.body);
				db.insert(dbName,req.body)
					.then(({data, headers, status}) => {
						res.json({success_msg: 'successfully signed up'});
					})
					.catch(err => {
						console.log("error:", err);
						res.status(401).send({ error_msg: err });
					});
			});
		});
	 });
	 

	 app.post('/login',function(req,res){
		 console.log('/login:',req.body);
		 let doc = db.mango(dbName, {
			 selector: {
					email: req.body.email}
			},{}).then(function(data) { 
				// Data    ---> data.data
				// Headers ---> data.headers
				// Status  ---> data.status

				var hash= data.data.docs[0].password;
				console.log(hash);
				bcrypt.compare(req.body.password, hash)
					.then(function(success) {
						if(success) 
							 res.json(data.data.docs[0]);
						else
							res.status(401).send({error_msg:err});
						})
					.catch(err => res.status(401).send({error_msg:err}));
			}).catch(err => {
				console.log(err);
				res.status(401).send({ error_msg: err });
			});
		
	 })
 
	 





///////////////////////////////////////////////////////////////////END OF SCOPE////////////////////////////////////////////////////////////
// for sending a file as response:
	//res.sendFile('./app/view/index.html',{root:__dirname});
// for sending with status
	//res.status(200).send({message:''});
	//res.status(401).send({error:err});
// for sending or creating a error manually
	//use res.end() for sending a error manually
//res.json(user);

//server settings
	app.listen(port,function(error){
		if(error) throw error
			console.log('server started on:',port);
	});
