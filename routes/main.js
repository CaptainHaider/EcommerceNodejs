var router= require('express').Router();

var Product=require('../modules/product');

Product.createMapping(function(err,mapping){//creating a bridge between product database and elastic search
	if(err) {
		console.log('error creating mapping');
	}
	else{
		console.log('mapping completed');
		console.log(mapping);
	}
});

var stream =Product.synchronize();
var count=0;

stream.on('data',function(){
	count++;
});

stream.on('close',function(){
	console.log('Indexed'+count+' documents');
});

stream.on('error',function(err){
	console.log(err);
});
router.post('/search',function(req,res,next){
	res.redirect('/search?q='+req.body.q);
});
router.get('/search',function(req,res,next){
	if(req.query.q){
		Product.search({
			query_string:{query:req.query.q}
		},function(err,results){
			if(err) return next(err);
		var data=results.hits.hits.map(function(hit){
			return hit;
		});
		res.render('main/search-result',{
			query:req.query.q,
			data:data
		});
		});
	}
});
//for searching
router.post('/search',function(req,res,next){
	res.redirect('/search?q='+req.body.q);
});
router.get('/search',function(req,res,next){
	if(req.query.q){
		Product.search({
			query_string:{query:req.query.q}

			},function(err,results){
				if(err) return next(err);
				var data=results.hits.hits.map(function(hit){
					return hit;
				});
				res.render('main/search-result',{
					query:req.query.q,
					data:data
				});
			});
		 
	}
});

//Adding pagination
router.get('/',function(req,res,next){
	if(req.user){//if u r login //then run pagination
  	
  	var perPage=9;
  	var page=req.params.page;

  	Product
  	.find()
  	.skip(perPage*page)//9*1 for page 1;9*2 for page 2 //skiping documents	
  	.limit(perPage)//how many document u want per query
  	.populate('category')
  	.exec(function(err,products){
  		if(err) return next(err);
  		Product.count().exec(function(err,count){
  			if(err) return next(err);
  			res.render('main/product-main',{
  				products:products,
  				pages: count/perPage //how many pages we gona have
  			});
  		});
  	});

	}
	else{
	res.render('main/home');	
	}
});

router.get('/about',function(req,res){
	res.render('main/about');
});

//this route will add category on each page
router.get('/products/:id',function(req,res,next){
	Product
	.find({category:req.params.id})
	.populate('category')
	.exec(function(err,products){
		if(err) return next(err);
		res.render('main/category',{
			products:products//it will be stored in array "products"
		});
	});
});

router.get('/product/:id',function(req,res,next){
	Product.findById({_id:req.params.id},function(err,product){
		if(err) return next(err);
		res.render('main/product',{
			product:product
		});
	});
});
//

module.exports=router;