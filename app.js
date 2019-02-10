var Express = require('express');
var BodyParser = require('body-parser');
var Multer = require('multer');
var app = Express();
var upload = Multer();
var database = require('./database');
var fs = require('fs');

app.use(Express.static('public'));
app.use(BodyParser.urlencoded({extended:true}));
app.use(BodyParser.json());

var path = "/home/jsh/WaifuDB"


var upload = Multer({
  dest: path+"/temp"
})

app.get('/', function(req,res) {
  res.sendFile(path+"/public/index.html");
});

app.get("/ims/:fname", function(req,res) {
  var fname = req.params.fname;
  res.sendFile(path+"/ims/" + fname);
});

app.get("/public/:fname", function(req,res) {
  var fname = req.params.fname;
  res.sendFile(path+"/public/" + fname);
})

app.post('/add', function(req,res) {
  console.log("Received:");
  console.log(req.body);
  database.addWaifu(req.body);
  res.status(201).json(req.body.name);
});

app.post('/login', function(req,res) {
  console.log("Login with:");
  database.loginAttempt(req.body.username,req.body.password, function(succ) {
    if(succ) {
      console.log("Login successful");
      res.writeHead(202);
      res.end("Nice");
    } else {
        console.log("Login failed");
        res.writeHead(405);
        res.end("Not Nice");
    }
  });
})


app.get("/main/:key", function(req,res){
  console.log("Key object: " + JSON.stringify(req.params));
  if(req.params.key === "sauce"){
    res.sendFile(path+"/public/main.html");
  } else{
    switch(req.params.key) {
      case "submit":
        res.sendFile(path+"/public/submitWaifu.html");
	console.log("Sending html for submit waifu");
        break;
      default:
        res.send("no");
    }
  }
})

app.post('/create', function(req,res) {
  console.log("User account creating with: ");
  console.log(req.body);
  database.createUser(req.body.username,req.body.password);
})

app.get('/waifu/:name/:p/:s/:a/:m/:i', function(req,res) {
  database.queryWaifu(req.params.name,req.params.p=="y",req.params.s=="y",req.params.a=="y",req.params.m=="y",req.params.i=="y").then(waifu => {
    console.log(waifu);
    res.send(waifu)
  })
})

app.listen(8000, () => console.log("Running on port 8000!"));
