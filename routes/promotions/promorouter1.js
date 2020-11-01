const express=require("express");
const bodyParser=require("body-parser");
const promotions=express.Router();
const promotionsQuery=express.Router();
promotions.use(bodyParser.json());
promotionsQuery.use(bodyParser.json());
promotions.route("/")
.all(function(req,res,next){
    res.statusCode=200;
    res.setHeader('content-type','plain/text');
    next();
})
.get(function(req,res,next){
    res.end("will send you the promotions");
})
.post(function(req,res,next){
    res.end("will add the promotions: "+req.body.name+" with details: "+req.body.descriptions);
})
.put(function(req,res,next){
    res.statusCode=403;
    res.end("Put operations is denied");
})
.delete(function(req,res,next){
   res.end("will delete all the promotions");
});
promotions.route("/:id")
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader("content-type","plain/text");
    next();
})
.get((req,res,next)=>{
    res.end("will get the promotions of "+req.params.id);
})
.post(function(req,res,next){
    res.statusCode=403;
    res.end("post operations is denied :"+"with details:"+ req.params.id);
})
.put(function(req,res,next){
    
    res.end("promotions with"+req.params.id+"will be updated");
})
.delete(function(req,res,next){
   res.end("will delete the promotions of "+req.params.id);
});
module.exports=promotions;
