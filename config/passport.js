var passport=require('passport');
var User =require('../modules/user');
var LocalStrategy=require('passport-local').Strategy;//npm install passport-local --save

//serialize and deserialize
// passport needs ability to serialize and unserialize users out of session
passport.serializeUser(function(user,done){//seralize is the process of datasttructure/object into a format that it can be stored
	done(null,user._id);//id is created default
});

passport.deserializeUser(function(id,done){//to retrive whole object
	User.findById(id,function(err,user){
		done(err,user);
	});
});

//Middleware
passport.use('local-login',new LocalStrategy({
	usernameField :'email',
	passwordField:'password',
	passReqToCallback:true
},function(req,email,password,done){
	User.findOne({email:email},function(err,user){
		if(err) return done(err);

		if(!user) 
			return done(null,false,req.flash('loginMessage','No user has been found'));
		 

		if(!user.comparePassword(password)) 
			return done(null,false,req.flash('loginMessage','wrong password'));
		 
		else
			return done(null,user);


	})
}));

//custom function to validate
exports.isAuthenticated=function(req,res,next){
	if(req.isAuthenticated()){
	return next();
	}
	else
		res.redirect('/login');
}