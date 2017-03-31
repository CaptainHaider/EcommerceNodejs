var router= require('express').Router(); 
var User=require('../modules/user');
var passport=require('passport');
var passportConfig=require('../config/passport');
var User =require('../modules/user');



//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
					//LOGOUT
////////////////////////////////////////////////////////////////////////////////////////////////////////

 router.get('/logout',function(req,res){
 	req.logout();
 	res.redirect('/');
 });
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
					//PROFILE
////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/profile',function(req,res,next){
	//res.json(req.user);
	//res.render('./accounts/profile');
	User.findOne({_id:req.user._id},function(err,user){
		if(err) return next(err);
		else res.render('./accounts/profile',{user:user});
	});
 });

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
					//LOGIN
////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/login',function(req,res){
	if(req.user) return res.redirect('/');//if its login user
	res.render('accounts/login',{message: req.flash('loginMessage')})//else display 
});

router.post('/login',passport.authenticate('local-login',{
	successRedirect :'/profile',
	failureRedirect:'/login',
	failureFlash: true
}));//passport middleware


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.get('/edit-profile',function(req,res,next){
	res.render('accounts/edit-profile.ejs',{message:req.flash('sucess')});
});

router.post('/edit-profile',function(req,res,next){
	User.findOne({_id:req.user._id},function(err,user){//if user has same id that is currently login which mean that only login user can change its own profile
		if(err) return next(err);

		if(req.body.name) user.profile.name=req.body.name;

		if(req.body.address) user.address=req.body.address;

		user.save(function(err){
			if(err) return next(err);

			req.flash('sucess','Successfully Edited your profile');
			return res.redirect('/edit-profile');

		});
	});
});





//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
					//SIGNUP 
////////////////////////////////////////////////////////////////////////////////////////////////////////


router.get('/signup',function(req,res,next){

	 res.render('./accounts/signup',{
		error: req.flash('error')
	});
});


 
router.post('/signup',function(req,res,next){

var user =new User();

user.profile.name=req.body.name;
user.email=req.body.email;
user.password =req.body.password;
user.profile.picture=user.gravatar();


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++




User.findOne({ email :req.body.email},function(err,existingUser){

	if(existingUser){
	//	console.log(req.body.email+" is already exist");
		req.flash('error','Account with that email address already exists');
		return res.redirect('/signup');
	}
	else{
		user.save(function(err,user){
			if(err) return next(err);

			else {
				//res.json("new user have been created");
			//	return res.redirect('/');
			req.logIn(user,function(err){//logIn is adding session and cookie to router
				if(err) return next(err);
				else res.redirect('/profile');
			});
			}
			
		
		});
	}

	});
});


module.exports=router;











