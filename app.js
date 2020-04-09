var express = require("express");
var app = express();

var  rPromise = require("request-promise"); 
app.use(express.static("public"));

// app.set("view engine", "ejs");

app.listen("8000",function(){
    console.log("Service started");
});

app.get("/", function(req,res){
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
app.get("/gallary", function(req,res){
    res.render("gallary.ejs");
});
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
