const bodyParser=require('body-parser');
const User=require('../models/users');
const express = require('express');
const router = express.Router();
router.use(bodyParser.json());
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function(req, res, next) {
   User.findOne({username:req.body.username})
   .then((user)=>{
      if(user!=null)
      {
        let err=new Error("User "+req.body.username+" already exists");
        err.status=403;
        next(err);
      }
      else
      {
       return User.create({
           username:req.body.username,
           password:req.body.password
         });
      }
   })
   .then((user)=>{ //promise of user.create
     console.log("User Signed Up Successfully");
     res.statusCode=200;
     res.setHeader('Content-Type','application/json');
     res.json({status:'Registrated Successfully!',user:user});
   },((err)=>next(err)))
   .catch((err)=>next(err));
});

router.post('/login',function(req,res,next){
 
  if(!req.session.user)
  {
    var authHeader=req.headers.authorization;
    if(!(authHeader))
    {
      var err=new Error('Authorization Is Required');
      err.status=403;
      res.setHeader('WWW-Authenticate','Basic')
      return next(err);
    }
    var auth=Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');
    let username=auth[0];
    let password=auth[1];
    User.findOne({username:username})
    .then((user)=>{
       if(user==null)
        {
          let err=new Error("User "+req.body.username+" does not  exists");
          err.status=403;
          next(err);
        }
       else if(user.username==username && user.password==password)
        {
           console.log("User Signed In Successfully");
           req.session.user="authenticated";
           res.statusCode=200;
           res.setHeader('Content-Type','application/json');
           res.json({status:'Signed-In Successfully!',user:user});
        }
       else if(user.password==password)
        {
           let err=new Error("User Password is  Wrong");
           err.status=403;
           next(err);
        }
    })
    .catch((err)=>next(err));
  }
  else
    {
      console.log("User Signed In Successfully");
      res.statusCode=200;
      res.setHeader('Content-Type','application/json');
      res.json({status:'User Already Loged In'});
    }
}); 

router.get('/logout',function(req,res,next){
  if(req.session)
  {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else
  {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
}); 

module.exports = router;
