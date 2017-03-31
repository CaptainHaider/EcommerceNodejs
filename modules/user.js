var mongoose =require ('mongoose');

var bcrypt =require('bcrypt-nodejs');//to hash a password
//abc123 -> 123123aqwesaeqa
//to help security
var Schema=mongoose.Schema;
/*the user schema attributes/characters /fields*/
var crypto=require('crypto') ;

var UserSchema =new Schema({

email:{type:String,unique:true,lowercase:true},
password:String,


profile:{
 name:{type:String,default:''},
 picture:{type:String,default:''}
},

address:String,

history:[{
	date:Date,
	paid:{type:Number,default:0},
	//item:{type:Schema.Types.ObjectId,ref:''}
}]

});




/*Hash the password before we even save it to the database*/


UserSchema.pre('save',function(next){//pre save it before save it to data base

	var user=this;//userSchema

if(!user.isModified('password'))return next();
bcrypt.genSalt(10,function(err,salt){//random data ..generate random data //123ad..ten random data

if(err) return next(err);//if their is an error

bcrypt.hash(user.password,salt,null,function(err,hash){
	if(err) return next(err);
	user.password=hash;
	next();
  });	
 });
});


/*compare password in the database and the one that the user type*/
UserSchema.methods.comparePassword=function(password){
	return bcrypt.compareSync(password,this.password)
}

UserSchema.methods.gravatar =function(size){
	if(!this.size) size=200;
	if(!this.email) return 'https://gravatar.com/avatar/?s'+size+'&d=retro';
	var md5=crypto.createHash('md5').update(this.email).digest('hex');
	return 'https://gravatar.com/avatar/'+md5+'?s='+size+'&d=retro';

}

//export the whole schema
module.exports= mongoose.model('User',UserSchema);