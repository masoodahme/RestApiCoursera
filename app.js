var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose=require("mongoose");
const session=require("express-session");
const FileStore=require("session-file-store")(session);

const indexRouter = require('./routes/index');
const  usersRouter = require('./routes/users');
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
//app.use(cookieParser('1233'));
app.use(session({
  name:'session-id',
  secret:'122iewdcdakfjda',
  saveUninitialized:false,
  resave:false,
  store:new FileStore()
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

function auth(req,res,next)
{
  console.log(req.session);
  //if user is authenticating for first time
  if(!req.session.user)
  {
      var err=new Error('You are not Authorizated');
      err.status=401;
      res.setHeader('WWW-Authenticate','Basic')
      return next(err);
  }
  else
  {
    if(req.session.user=='authenticated')
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
