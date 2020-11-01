const express=require("express");
const bodyParser=require("body-parser");
const promotions=express.Router();
promotions.use(bodyParser.json());

promotions.route("/")
.get((req,res,next)=>{
    res.end("will get the details of promotions");
})
.post((req,res,next)=>{
    res.end("will post "+req.body.dish +" to the promotions sections");
})
.put((req,res)=>{
    res.statusCode=403;
    res.end("put operation is denied");
})
.delete((req,res,next)=>{
    res.end("will delete the details of promotions");
});

promotions.route("/:id")
.get((req,res,next)=>{
    
    res.end("will get the details of promotion of "+req.params.id);
})
.post((req,res,next)=>{
    res.statusCode=403;
    res.end("post operation of "+ req.params.id +"is denied");
})
.put((req,res)=>{
    res.end("promotion details of "+ req.params.id +" is updated");
})
.delete((req,res,next)=>{
    res.end("deleting the details of promotion of "+ req.params.id );
});
module.exports=promotions;


