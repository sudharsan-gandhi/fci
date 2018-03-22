const express = require("express"),
  app = express(),
  session = require("express-session"),
  flash = require("express-flash"),
  parser = require("body-parser"),
  statusMonitor = require("express-status-monitor")(),
  NodeCouchDb = require("node-couchdb"),
  dbName = "fci",
  bcrypt = require("bcrypt"),
  port = "8080", //change the port to ur wish but dnt commit this change.
  db = new NodeCouchDb(),
  passport = require("passport"),
  Strategy = require("passport-local").Strategy;
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
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
//passport js
passport.use(
  new Strategy(
    {
      usernameField: "email",
      passwordField: "password",
      name: "local",
      passReqToCallback: true
    },
    function(req, username, password, cb) {
      console.log("here1");
      db
        .mango(
          dbName,
          {
            selector: {
              email: username
            }
          },
          {}
        )
        .then(function(data, headers, status) {
          var hash = data.data.docs[0].password;
          console.log(hash);
          bcrypt
            .compare(password, hash)
            .then(function(success) {
              console.log("success", success);
              if (success) cb(null, JSON.stringify(data.data.docs[0]));
              else cb("enter correct password", null);
            })
            .catch(function(err){
				console.log(err);
				cb("some issues", null)
			});
        })
        .catch(function(err){
			cb("user not found", null)
		});
    }
  )
);
passport.serializeUser(function(user, cb) {
	console.log('in serialize');
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
	console.log('in deserialize');
  // db.users.findById(id, function (err, user) {
  // 	if (err) { return cb(err); }
  db.get(dbName,id).then((data, headers, status) => {
	  console.log('deserial',data,headers);
	  cb(null,data)}).catch(err =>cb(null, id));
  // });
});
//status monitor
//app.use(statusMonitor);
//session declaration
app.use(
  session({
    secret: "fci-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      maxage: 60000
    }
  })
);
app.use(flash());

//Static files handler
app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());
//app.get('/status', {} , statusMonitor.pageRoute)
//app.use('/{any_route_name}',express.static(_dirname='./{dir_name}'));
//request handler

/*
	app.get('/',function(req,res){
		res.sendFile('./app/view/index.html',{root:__dirname});
	});
*/
app.use(passport.initialize());
app.use(passport.session());
////////////////////////////////////////////////////////CODE ONLY HERE OR IMPORT CODE WITH IN THIS SCOPE////////////////////////////////////

app.post("/signup", function(req, res) {
  console.log("request:", req.body);
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      if (err) res.status(401).send({ error_msg: err });
      req.body.password = hash;
      console.log("after hashed:", req.body);
      db.insert(dbName, req.body).then(
        ({ data, headers, status }) => {
          res.json({ success_msg: "successfully signed up" });
        },
        err => {
          console.log("error:", err);
          res.status(401).send({ error_msg: err });
        }
      );
    });
  });
});
//console.log(JSON.stringify(passport));

app.post("/login", function(req, res, next) {
  passport.authenticate("local", function(err, user, info) {
    if (err) {
      return res.json({ error_msg: err });
    }
    if (!user) {
      return res.json({ error_msg: "invalid credentials" });
    }
    console.log("res:",req.headers);
    return res.json("success");
  })(req, res, next);
});

app.post("/logi", function(req, res) {
  console.log("/login:", req.body);
  let doc = db
    .mango(
      dbName,
      {
        selector: {
          email: req.body.email
        }
      },
      {}
    )
    .then(
      function(data, headers, status) {
        var hash = data.data.docs[0].password;
        console.log(hash);
        bcrypt
          .compare(req.body.password, hash)
          .then(function(success) {
            if (success) res.json(data.data.docs[0]);
            else res.status(401).send({ error_msg: err });
          })
          .catch(err => res.status(401).send({ error_msg: err }));
      },
      function(err) {
        console.log(err);
        res.status(401).send({ error_msg: err });
      }
    );
});

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
app.listen(port, function(error) {
  if (error) throw error;
  console.log("server started on:", port);
});
