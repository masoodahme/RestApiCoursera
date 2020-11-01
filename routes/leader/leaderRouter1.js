const express=require("express");
const bodyParser=require("body-parser");
const leaders=express.Router();
leaders.use(bodyParser.json());
leaders.route("/")
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader("content-type","plain/text");
    next();
})
.get((req,res,next)=>{
    res.end("will get the details of leaders");
})
.post((req,res,next)=>{
    res.end("will post "+req.body.name +" to the leaders sections");
})
.put((req,res)=>{
    res.statusCode=403;
    res.end("put operation is denied");
})
.delete((req,res,next)=>{
    res.end("will delete the details of leaders");
});

leaders.route("/:id")
.all((req,res,next)=>{
     res.statusCode=200;
     res.setHeader("content-type","plain/text");
     next();
})
.get((req,res,next)=>{
    res.end("will get the details of leaders of "+req.params.id);
})
.post((req,res,next)=>{
    res.statusCode=403;
    res.end("post operation of "+ req.params.id +"is denied");
})
.put((req,res)=>{
    res.end("leader details of "+ req.params.id +"is updated");
})
.delete((req,res,next)=>{
    res.end("deleting the details of leader of "+ req.params.id );
});
module.exports=leaders;

