const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const Dishes=require("../../models/dishes");
const dishes=express.Router();
dishes.use(bodyParser.json());

dishes.route("/")
.get((req,res,next)=>{
     Dishes.find({})
     .then((dishes)=>{
         res.statusCode=200;
         res.setHeader('Content-Type','application/json');
         res.json(dishes);
     },((err)=>next(err)))
     .catch((err)=>next(err));
})
.post((req,res,next)=>{
    Dishes.create(req.body)
    .then((dish)=>{
        console.log("Dish Created");
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    },((err)=>next(err)))
    .catch((err)=>next(err));
})
.put((req,res,next)=>{
    res.statusCode=403;
    res.end("put operation is denied");
})
.delete((req,res,next)=>{
    Dishes.remove({})
    .then((resp)=>{
        console.log("Dish Removed");
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },((err)=>next(err)))
    .catch((err)=>next(err));
});

dishes.route("/:id")
.get((req,res,next)=>{
    Dishes.findById(req.params.id)
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    },((err)=>next(err)))
    .catch((err)=>next(err));
})
.post((req,res,next)=>{
    res.statusCode=403;
    res.end("post operation of "+ req.params.id +"is denied");
})
.put((req,res,next)=>{
    Dishes.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    },((err)=>next(err)))
    .catch((err)=>next(err));
})
.delete((req,res,next)=>{
    Dishes.findByIdAndRemove(req.params.id)
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },((err)=>next(err)))
    .catch((err)=>next(err));
});

// Comments
dishes.route("/:id/comments")
.get((req,res,next)=>{
     Dishes.findById(req.params.id)
     .then((dish)=>{
         if(dish!=null)
         {
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(dish.comments);
         }
         else{
             err=new Error('Dish '+req.params.id+" not found ");
             err.statusCode=404;
             return next(err);
         }
     },((err)=>next(err)))
     .catch((err)=>next(err));
})
.post((req,res,next)=>{
    Dishes.findById(req.params.id)
     .then((dish)=>{
         if(dish!=null)
         {
            dish.comments.push(req.body);
            dish.save()
            .then((dish)=>{
                console.log("Dish comment created");
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(dish);
            },((err)=>next(err)))
         }
         else{
             err=new Error('Dish '+req.params.id+" not found ");
             err.statusCode=404;
             return next(err);
         }
     },((err)=>next(err)))
     .catch((err)=>next(err));
})
.put((req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported on /dishes/'
        + req.params.id + '/comments');
})
.delete((req,res,next)=>{
    Dishes.findById(req.params.id)
    .then((dish)=>{
        if(dish!=null)
        {
           for(var i=(dish.comments.length-1);i>=0;i--)
           {
               dish.comments.id(dish.comments[i]._id).remove();
           }
           dish.save()
            .then((dish)=>{
                console.log("Dish comment created");
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(dish);
            },((err)=>next(err)))
        }
        else{
            err=new Error('Dish '+req.params.id+" not found ");
            err.statusCode=404;
            return next(err);
        }
    },((err)=>next(err)))
    .catch((err)=>next(err));
});

//commentsId

dishes.route("/:id/comments/:commentsId")
.get((req,res,next)=>{
    Dishes.findById(req.params.id)
    .then((dish)=>{
        if(dish!=null && dish.comments.id(req.params.commentsId)!=null)
        {
           res.statusCode=200;
           res.setHeader('Content-Type','application/json');
           res.json(dish.comments.id(req.params.commentsId));
        }
        else if(dish==null)
        {
            err=new Error('Dish '+req.params.id+" not found ");
            err.statusCode=404;
            return next(err);
        }
        else{
            err=new Error('Dish Comment'+req.params.commentsId+" not found ");
            err.statusCode=404;
            return next(err);
        }
    },((err)=>next(err)))
    .catch((err)=>next(err));
})
.post((req,res,next)=>{
    res.statusCode=403;
    res.end('POST operation not supported on /dishes/'
        + req.params.id + '/comments');
})
.put((req,res)=>{
    Dishes.findById(req.params.id)
    .then((dish)=>{
        if(dish!=null && dish.comments.id(req.params.commentsId)!=null)
        {
            //user is allowed to update rating and comment 
            if(req.body.rating)
            {
                dish.comments.id(req.params.commentsId).rating=req.body.rating;
            }
            if(req.body.comment)
            {
                dish.comments.id(req.params.commentsId).comment=req.body.comment;
            }
            dish.save()
            .then((dish)=>{
    
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(dish);
            },((err)=>next(err)))
        }
        else if(dish==null)
        {
            err=new Error('Dish '+req.params.id+" not found ");
            err.statusCode=404;
            return next(err);
        }
        else{
            err=new Error('Dish Comment'+req.params.commentsId+" not found ");
            err.statusCode=404;
            return next(err);
        }
    },((err)=>next(err)))
    .catch((err)=>next(err));
})
.delete((req,res,next)=>{
    Dishes.findById(req.params.id)
    .then((dish)=>{
        if(dish!=null && dish.comments.id(req.params.commentsId)!=null)
        {
            dish.comments.id(req.params.commentsId).remove();
            dish.save()
            .then((dish)=>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(dish);
            },((err)=>next(err)))
        }
        else if(dish==null)
        {
            err=new Error('Dish '+req.params.id+" not found ");
            err.statusCode=404;
            return next(err);
        }
        else
        {
            err=new Error('Dish Comment'+req.params.commentsId+" not found ");
            err.statusCode=404;
            return next(err);
        }
    },((err)=>next(err)))
    .catch((err)=>next(err));
});

module.exports=dishes;


