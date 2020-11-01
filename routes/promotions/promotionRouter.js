const express=require("express");
const bodyParser=require("body-parser");
const Promotion=require("../../models/promotions");
const promotions=express.Router();
promotions.use(bodyParser.json());

promotions.route("/")
.get((req,res,next)=>{
    Promotion.find({})
    .then((promotions)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promotions);
    },((err)=>next(err)))
    .catch((err)=>next(err));
})
.post((req,res,next)=>{
    Promotion.create(req.body)
    .then((promotion)=>{
        console.log("Promotion Created");
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promotion);
    },((err)=>next(err)))
    .catch((err)=>next(err));
})
.put((req,res,next)=>{
    res.statusCode=403;
    res.end("put operation is denied");
})
.delete((req,res,next)=>{
    Promotion.remove()
    .then((resp)=>{
        console.log("Promotions Deleted Successfully");
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },((err)=>next(err)))
    .catch((err)=>next(err));
});

promotions.route("/:promoid")
.get((req,res,next)=>{
    Promotion.findById(req.params.promoid)
    .then((promotion)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promotion);
    },((err)=>next(err)))
    .catch((err)=>next(err));
})
.post((req,res,next)=>{
    res.statusCode=403;
    res.end("post operation of "+ req.params.promoid +"is denied");
})
.put((req,res,next)=>{
    Promotion.findByIdAndUpdate(req.params.promoid,
        {
          $set:req.body
        },
        {
            new:true
        })
    .then((promotion)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promotion);
    },((err)=>next(err)))
    .catch((err)=>next(err));
})
.delete((req,res,next)=>{
    Promotion.findByIdAndRemove(req.params.promoid)
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },((err)=>next(err)))
    .catch((err)=>next(err));
});
module.exports=promotions;


