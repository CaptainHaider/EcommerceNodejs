var router =require('express').Router();
var Category=require('../modules/category');

router.get('/add-category',function(req,res,next) {
	res.render('admin/add-category',{message:req.flash('success')});
});
router.post('/add-category',function(req,res,next){
	var category=new Category();//its reling on category schema
	category.name=req.body.name;//save data in category field

	category.save(function(err){//save data to database
		if(err) return next(err);
		req.flash('success','Succesfully added a category');
		return res.redirect('/add-category');

	});

});
module.exports=router;
