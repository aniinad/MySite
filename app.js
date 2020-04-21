var express = require("express");
var app = express();
var passport = require("passport");
var nodemailer = require("nodemailer");

var  mongoose = require("mongoose");
var bodyParser = require("body-parser");
var LocalStrategy = require("passport-local");
var User = require("./models/user");

var  rPromise = require("request-promise"); 
app.use(express.static("public"));


mongoose.connect(process.env.MONGODB_URI||"mongodb+srv://aniinad:123@cluster0-rigfj.azure.mongodb.net/mysite?retryWrites=true&w=majority",{useNewUrlParser: true});
const conn = mongoose.connection;
mongoose.connection.once('open', () => { console.log('MongoDB Connected'); });
mongoose.connection.on('error', (err) => { console.log('MongoDB connection error: ', err); }); 
app.set("view engine", "ejs");


app.listen(process.env.PORT||8000,function(){
    console.log("Service started");
});


//Passport Configuration
app.use(require("express-session")({
    secret:"Nandu is a good boy",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
})
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req,res){
    console.log(req.user);
    res.render("index.ejs");
});
app.get("/home", function(req,res){
    res.render("index.ejs");
});
app.get("/about", function(req,res){
    res.render("about.ejs");
});
app.get("/contact", function(req,res){
    res.render("contact.ejs");
});
app.post("/contact", function(req,res){
    //email sending logic goes here
     // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'chow.anil@gmail.com',
        pass: 'Need to add'
    }
  });

  // send mail with defined transport object
    transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "chow.anil@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>" // html body
  },(err,info)=>{
      if(err){
          return console.log(err);
      }
      console.log("Message sent: %s", info.messageId);
  });

  
});
app.get("/gallary", function(req,res){
    res.render("gallary.ejs");
});

app.get("/updates",isLoggedIn,function(req,res){
    res.render("updates.ejs");
})

//Auth routes
app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register", function(req,res){
    
    User.register(new User({username: req.body.username}),
        req.body.password,function(err, user){
            if(err)
            {
                console.log(err);
                return res.render("register");
            }
            passport.authenticate("local")(req,res,function(){
                res.redirect("/");
            })
        })
})


//Login form
app.get("/login", function(req,res){
    res.render("login");
})

app.post("/login",passport.authenticate("local",
{successRedirect:"/updates",
failureRedirect:"/login"
}),function(req,res){

})

//Logout route
app.get("logout",function(req,res){
 req.session.destroy((err) => {
	if(err) return next(err)

	req.logout()

	res.redirect("/");
})
    // req.logout();
    // res.redirect("/");
})

function isLoggedIn(req,res,next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect("/login");
}

app.get("/movie", function(req,res){
    //res.render("movieSearch.ejs");
    var searchKey = req.query.search;
    console.log(searchKey);
    rPromise("http://www.omdbapi.com/?s="+searchKey+"&apikey=thewdb").then((str)=>{
        var movieList = JSON.parse(str);
        
        res.render("movieSearch.ejs",{movies:movieList["Search"]});       
    })
    .catch((err) =>{
        console.log(`error ${0}`,err);
    });
});
app.get("*",function(req,res){
    res.redirect("/");
});
