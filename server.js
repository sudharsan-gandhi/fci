const 	express			=	require('express'),
		app				=	express(),
		session			=	require('express-session'),
		flash 			=  	require('express-flash'),
		parser 			=	require('body-parser'),
		statusMonitor 	= 	require('express-status-monitor')(),
		NodeCouchDb 	= 	require('node-couchdb'),
		dbName			=   'fci',		
		bcrypt			=	require('bcrypt'),
		port			=	'8080',//change the port to ur wish but dnt commit this change.
	 	db 				= 	new NodeCouchDb(),
		passport 		= 	require('passport'),
		LocalStrategy 	= 	require('passport-local').Strategy;
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
	app.use(flash());
//body parser
	app.use(parser.json());
//passport js
passport.use(new LocalStrategy({

	},	
	function(username, password) {
		console.log('asadf');
	//   db.users.findByUsername(username, function(err, user) {
		// if (err) { return cb(err); }
		// if (!user) { return cb(null, false); }
		// if (user.password != password) { return cb(null, false); }
	//   });
	}));
	passport.serializeUser(function(user, done) {
		console.log('serialized',user.id);
		done(null, user.id);
	  });
	  
	  passport.deserializeUser(function(id, done) {
		//User.findById(id, function(err, user) {
			console.log(id)
		  done(err, id);
		//});
	  });
	app.use(passport.initialize());
	app.use(passport.session());

	

	  
	//app.get('/status', {} , statusMonitor.pageRoute)
//Static files handler
	//app.use('/{any_route_name}',express.static(_dirname='./{dir_name}'));
//request handler

/*
	app.get('/',function(req,res){
		res.sendFile('./app/view/index.html',{root:__dirname});
	});
*/
////////////////////////////////////////////////////////CODE ONLY HERE OR IMPORT CODE WITH IN THIS SCOPE////////////////////////////////////

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
					}, err => {
						console.log("error:",err);
						res.status(401).send({error_msg:err});
					});
			});
		});
	});
	app.post('/login',passport.authenticate('local'))
		
	app.post('/logi',function(req,res){
		 console.log('/login:',req.body);
		 let doc = db.mango(dbName, {
			 selector: {
					email: req.body.email}
			},{}).then(function(data,headers,status) { 
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
			},
			function(err){
				console.log(err);
				res.status(401).send({error_msg:err});
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
