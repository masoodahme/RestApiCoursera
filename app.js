var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose=require("mongoose");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const promotionsRouter=require('./routes/promotions/promotionRouter');
const leaderRouter=require('./routes/leader/leaderRouter');
const dishRouter=require("./routes/dish/dishRouter");


const url="mongodb://localhost:27017/Confusion";
const connect=mongoose.connect(url);

connect.then((db)=>{
  console.log("DataBase Connected Successfully");
},((err)=>console.log("Connection Failed")));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('1233'));

function auth(req,res,next)
{
  console.log(req.signedCookies);
  //if user is authenticating for first time
  if(!req.signedCookies.user)
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
    let userName=auth[0];
    let password=auth[1];
    console.log(userName+" "+password);
    if(userName=="admin" && password=="password")
    {
      res.cookie('user','admin',{signed:true});
      next();
    }
    else
    {
      var err=new Error('Authorization Failed');
      err.status=401;
      res.setHeader('WWW-Authenticate','Basic')
      return next(err);
    }
  }
  else
  {
    if(req.signedCookies.user=='admin')
    {
      next();
    }
    else{
      var err=new Error('Authorization Failed');
      err.status=401;
      res.setHeader('WWW-Authenticate','Basic')
      return next(err);
    }
  }
}
app.use(auth);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/promotions",promotionsRouter);
app.use("/leaders",leaderRouter);
app.use("/dishes",dishRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log("errr ");
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
   console.log("errr 1");
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
