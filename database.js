var sequelize = require('sequelize');
var scryptsy = require('scryptsy');
var fs = require('fs');
var request = require('request');

module.exports = {
  addWaifu:addWaifu,
  getWaifu:getWaifu,
  createUser:createUser,
  loginAttempt:loginAttempt
}

var path = "/home/jsh/WaifuDB"

var connection = new sequelize('waifus','root','password',{
  dialect: 'sqlite',
  storage: './waifus.db'
});

var Waifu = connection.define('waifu',{
  name:{
    type:sequelize.STRING(),
    unique:true
  },
  series:sequelize.STRING()
});

var Personality = connection.define('personality',{
  caring:sequelize.INTEGER(),
  reliable:sequelize.INTEGER(),
  entertaining:sequelize.INTEGER(),
  impression:sequelize.INTEGER()
});

var Skills = connection.define('skills',{
  combat:sequelize.INTEGER(),
  intelligence:sequelize.INTEGER(),
  utility:sequelize.INTEGER(),
  family:sequelize.INTEGER()
});

var Appearance = connection.define('appearance',{
  cute:sequelize.INTEGER(),
  cool:sequelize.INTEGER(),
  breasts:sequelize.INTEGER(),
  ass:sequelize.INTEGER(),
  attitude:sequelize.INTEGER()
});

var Misc = connection.define('misc',{
  age:sequelize.INTEGER(),
  meme:sequelize.INTEGER()
});

var User = connection.define('user',{
  username:sequelize.STRING(),
  hash:sequelize.STRING(),
  salt:sequelize.STRING()
});

var Image = connection.define('image', {
  filename:sequelize.STRING()
})

Personality.belongsTo(Waifu);
Skills.belongsTo(Waifu);
Appearance.belongsTo(Waifu);
Misc.belongsTo(Waifu);
Image.belongsTo(Waifu);
/*function addWaifu(name_,series_) {
  connection.sync().then(()=>{
    Waifu.create({
      name:name_,
      series:series_
    });
  });
}*/

function addWaifu(waifu) {
  connection.sync({force:false}).then(()=>{
    Waifu.create({
      name:waifu.name,
      series:waifu.series
    }).then((waifuModel) => {
      var id = waifuModel.id;
      if(waifu.p != "none") {
        connection.sync().then(() => {
          Personality.create({
            caring:waifu.p[0],
            reliable:waifu.p[1],
            entertaining:waifu.p[2],
            impression:waifu.p[3],
            waifuID:id
          });
        });
      }
      if(waifu.s != "none") {
        connection.sync().then(() => {
          Skills.create({
            combat:waifu.s[0],
            intelligence:waifu.s[1],
            utility:waifu.s[2],
            family:waifu.s[3],
            waifuID:id
          });
        });
      }
      if(waifu.a != "none") {
        connection.sync().then(() => {
          Appearance.create({
            cute:waifu.a[0],
            cool:waifu.a[1],
            breasts:waifu.a[2],
            ass:waifu.a[3],
            attitude:waifu.a[4],
            waifuID:id
          });
        });
      }
      if(waifu.m != "none") {
        connection.sync().then(() => {
          Misc.create({
            age:waifu.m[0],
            meme:waifu.p[1],
            waifuID:id
          });
        });
      }
      if(waifu.l != "none") {
        //Count files in ims
        var filename = "error"
        fs.readdir(path+"/ims", function(err,files) {
	  if(err) {
		console.log(err)
	  }
          console.log("\nFiles:");
          console.log(files);
          var numFiles = files.length;
          filename = path+"/ims/waifu"+(numFiles+1)+".jpg"
          downloadImage(waifu.l,filename)
        })
        connection.sync().then(() => {
          Image.create({
            filename:filename
          });
        });
      }
    });
  });
}

function getWaifu(name_) {
  connection.sync().then(() => {
    Waifu.findAll({
      where: {
        name:name_
      }
    }).then(function(waifus){
      if(waifus) {
        console.log("Found!");
      }
      console.log("\nWaifu:");
      console.log(waifus[0].dataValues);
    });
  });
}

function loginAttempt(username_,password, callback) {
  var result = false;
  connection.sync().then(() => {
    User.findAll({
      where: {
        username:username_,
      }
    }).then(function(user) {
      if(!user) {
        console.log("No user with that name");
      } else {
        console.log("\n\nHashing\n\n");
	console.log(user[0])
        console.log(user[0].dataValues);
        var hash_ = scryptsy(password,user[0].dataValues.salt.toString(),16384,8,1,64);
        var toReturn = user[0].dataValues.hash.equals(hash_);
        console.log(toReturn);
        callback(toReturn);
      }
    })
  })
}

function createUser(username_,password) {
  var salt_ = Math.floor(Math.random() * 65536).toString(16);
  var hash_ = scryptsy(password,salt_,16384,8,1,64);
  connection.sync().then(()=>{
    User.create({
      username:username_,
      hash:hash_,
      salt:salt_
    });
  });
}

function downloadImage(uri,filename) {
  request.head(uri,function(err,res,body) { try {
    request(uri).pipe(fs.createWriteStream(filename));//.on('close', callback);
  } catch(err) {
	console.log("Shit url")
  }
  });
}
