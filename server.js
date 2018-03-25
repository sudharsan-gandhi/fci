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
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
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

 	app.post('/signup', validation(),function(req,res,next){
		let doc = db.mango(dbName, {
			selector: {
				   email: req.body.email}
		   },{}).then(data => 
			res.status(401).send({error_msg: 'Email already in use',path: '/signUp'}));
		 console.log('request:',req.body); 
		 const errors = validationResult(req);
		 if(!errors.isEmpty())
		 {
			res.status(401).send({error_msg: errors.mapped(),path: '/signUp'});
		 }
		 else
		 {
		    bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(req.body.password,salt, function(err, hash) {
				if(err) res.status(401).send({error_msg:err,path: '/signUp'});
				req.body.password = hash;
				console.log('after hashed:', req.body);
				db.insert(dbName,req.body)
					.then(({data, headers, status}) => {
						res.json({success_msg: 'successfully signed up'});
						res.status(200).send({success_msg,path: '/login' });
					})
					.catch(err => {
						console.log("error:", err);
						res.status(401).send({ error_msg: err ,path: '/signUp'});
					});
			});
		});
	 }
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
						var redirect;	
						console.log(data.data.docs[0].role)		
						if(success)
						{ 
							if(data.data.docs[0].role == 'miller')
							{
								redirect = "miller/dashboard";
							}
							else 
							{
								if(data.data.docs[0].role == 'manager')
								redirect = "manager/dashboard";
							}
							res.status(200).send({data : data.data.docs[0],path: redirect });
						}		
						 else
						 {
							res.status(401).send({error_msg: "Invalid Password",path :"/login"});
						 }
						})
					.catch(err => res.status(401).send({error_msg: "Try after sometime" ,path :"/login" }));
			}).catch(err => {
				res.status(403).send({ error_msg: "Invalid UserName" ,path :"/login"});
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

	function validation(){
		return [
		check('email').isEmail().withMessage('Please Enter valid email').trim().normalizeEmail(),
	  	check('password', 'passwords must be at least 6 chars long contain one number,one capital letter and one small letter').isLength({ min: 6 }).matches('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}'),
		check('first_name','Enter Mininium length of 5 and maximum length of 30').isLength({min:5}).isLength({max:30}).matches('(?:[a-zA-z.\\s])'),
		check('last_name','Last Name should be only string ,dot and space').matches('(?:[a-zA-z.\\s])'),
		//check('middle_name','Middle Name should be only string ,dot and space').matches('(?:[a-zA-z.\\s])').isEmpty
	]
	}

	