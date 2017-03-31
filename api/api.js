var router=require('express').Router();
var async=require('async');//npm install faker async --save //to avoid asyn programing
var faker=require('faker');
var Category=require('../modules/category');
var Product=require('../modules/product');


router.get('/:name',function(req,res,next) {//to search using name like "food" 
async.waterfall([

		function(callback){//[0] 
				Category.findOne({name:req.params.name},function(err,category){//find  name in database of category
				if(err) return next(err);
				callback(null,category);//passing in callback into A
			});
		},
		function(category,callback){//A
			for(var i=0;i<30;i++){
				var product=new Product();
				product.category=category._id;
				product.name=faker.commerce.productName();
				product.price=faker.commerce.price();
				product.image=faker.image.image();
			
				product.save();
			}

		}
	]);
res.json({message:'success'});
});

module.exports=router;
