const 	express			=	require('express'),
		app				=	express(),
		session			=	require('express-session'),
		parser 			=	require('body-parser'),
		statusMonitor 	= 	require('express-status-monitor')(),
		NodeCouchDb 	= 	require('node-couchdb'),
		dbName			=   'fci',		
		port			=	'8080';//change the port to ur wish but dnt commit this change.
const 	db 				= 	new NodeCouchDb();
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

 	app.post('/user',function(req,res){
 		
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
