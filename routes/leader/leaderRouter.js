const express=require("express");
const bodyParser=require("body-parser");
const Leader=require("../../models/leaders");
const leaders=express.Router();
leaders.use(bodyParser.json());

leaders.route("/")
.get((req,res,next)=>{
    Leader.find({})
    .then((leaders)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders);
    },((err)=>next(err)))
    .catch((err)=>next(err));
})
.post((req,res,next)=>{
    Leader.create(req.body)
    .then((leader)=>{
        console.log("Leader Created");
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },((err)=>next(err)))
    .catch((err)=>next(err));
})
.put((req,res,next)=>{
    res.statusCode=403;
    res.end("put operation is denied");
})
.delete((req,res,next)=>{
    Leader.remove()
    .then((resp)=>{
        console.log("Leaders Deleted Successfully");
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },((err)=>next(err)))
    .catch((err)=>next(err));
});

leaders.route("/:leaderid")
.get((req,res,next)=>{
    Leader.findById(req.params.leaderid)
    .then((leader)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },((err)=>next(err)))
    .catch((err)=>next(err));
})
.post((req,res,next)=>{
    res.statusCode=403;
    res.end("post operation of "+ req.params.leaderid +"is denied");
})
.put((req,res,next)=>{
    Leader.findByIdAndUpdate(req.params.leaderid,
        {
          $set:req.body
        },
        {
            new:true
        })
    .then((leader)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },((err)=>next(err)))
    .catch((err)=>next(err));
})
.delete((req,res,next)=>{
    Leader.findByIdAndRemove(req.params.leaderid)
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },((err)=>next(err)))
    .catch((err)=>next(err));
});
module.exports=leaders;


