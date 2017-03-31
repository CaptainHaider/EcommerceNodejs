var express =require ('express');//acquireing the lib that u wana use


/*
 * body-parser is a piece of express middleware that 
 *   reads a form's input and stores it as a javascript
 *   object accessible through `req.body` 
 *
 * 'body-parser' must be installed (via `npm install --save body-parser`)
 * For more info see: https://github.com/expressjs/body-parser
 */
var bodyParser =require('body-parser');//require body parser


var secret=require("./config/secret");
var User=require('./modules/user');
var Category=require('./modules/category');

//
var ejs = require('ejs');
var engine = require('ejs-mate');
//
var session=require('express-session');//to store session id ..it uses browser ...serverside storage
var cookieParser=require('cookie-parser');//parser cookie ...and put in request object
var flash=require('express-flash');
//
var MongoStore=require('connect-mongo/es5')(session);//npm install connect-mongo --save
//
var passport=require('passport'); //npm install passport --save
//

//
var app=express();

//
//+++++++++++++++++++++++++++++++++++

//to make connection to database
var mongoose = require('mongoose');
//mongoose.connect('mongodb://root:Dwarf@ds027419.mlab.com:27419/ecommerce',function(err){
	mongoose.connect(secret.database,function(err){
	if(err){
		console.log(err);
	}
	else{
		console.log("Connected to the database");
	}
});

//+++++++++++++++++++++++++++++++++++++



//++++++++++++++++++++++++++++++++++++++++++++++++++++
//it will log all request that user trying to get



										//MiddleWare
var morgan =require('morgan');
app.use(morgan('dev'));
//404 is forbiden page
app.use(express.static(__dirname+'/public'));//it now knows the public folder have a static file


 
// body-parser for retrieving form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
//00
//app.use(express.bodyParser());
//00

app.use(cookieParser());
// initialize passposrt and and session for persistent login sessions
app.use(session({
	resave:true,
	saveUninitialized:true,
	secret:secret.secretkey,
	store:new MongoStore({url:secret.database,autoReconnect:true})
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


app.use(function(req,res,next){//every route will have login user
	res.locals.user=req.user;
	next();
});

app.use(function(req,res,next){
	Category.find({},function(err,categories){//{} its mean empty query becz u want to search for every thing,categories mean result
		if(err) return next(err);
		res.locals.categories=categories;//to store in local variable
		next();
	});
});


app.engine('ejs',engine);
app.set('view engine','ejs');

var mainRoutes=require('./routes/main');
var userRoutes=require('./routes/user');
var adminRoutes=require('./routes/admin');
var apiRoutes=require('./api/api');

app.use(mainRoutes);
app.use(userRoutes);
app.use(adminRoutes);
app.use('/api',apiRoutes);
//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++


 //opening server
 /////////////////////////
app.listen(secret.port,function(err){
if(err) throw err;
console.log("server is running on port "+secret.port);
});
//++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++

//using postman 
/*
app.post('/create-user',function(req,res,next){
	var user=new User();

	user.profile.name=req.body.name;
	user.password=req.body.password;
	user.email=req.body.email; 

	user.save(function(err){
		if(err) return next(err);
		res.json('succesfully created new user');
	});
});
 	
*/


/*
 creating custom route
/////////////////////////////////////////////
//this is for home page

app.get('/homepage',function(req,res){
	var name="homepage"
	res.json("This is "+name);
});

//
app.get('/',function(req,res){
var name="haider";
res.json("My name is "+name);

});

app.get('/',function(req,res){
  res.render('main/home');
});

app.get('main/about',function(req,res){
	res.render('about');
});
*/ 
 //+++++++++++++++++++++++++++++++++++++++++++++++++++++

//app.post();//this is for posting form

//app.put();//this is for updating data

//app.delete();//deleting your data like deleting accont

//+++++++++++++++++++++++++++++++++++++++++++++++++++++

 