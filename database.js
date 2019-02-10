var sequelize = require('sequelize');
var scryptsy = require('scryptsy');
var fs = require('fs');
var request = require('request');

module.exports = {
  addWaifu:addWaifu,
  getWaifu:getWaifu,
  createUser:createUser,
  loginAttempt:loginAttempt,
  queryWaifu:queryWaifu
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
  series:sequelize.STRING(),
});

var Personality = connection.define('personality',{
  caring:sequelize.INTEGER(),
  reliable:sequelize.INTEGER(),
  entertaining:sequelize.INTEGER(),
  impression:sequelize.INTEGER(),
});

var Skills = connection.define('skills',{
  combat:sequelize.INTEGER(),
  intelligence:sequelize.INTEGER(),
  utility:sequelize.INTEGER(),
  family:sequelize.INTEGER(),
});

var Appearance = connection.define('appearance',{
  cute:sequelize.INTEGER(),
  cool:sequelize.INTEGER(),
  breasts:sequelize.INTEGER(),
  ass:sequelize.INTEGER(),
  attitude:sequelize.INTEGER(),

});

var Misc = connection.define('misc',{
  age:sequelize.INTEGER(),
  meme:sequelize.INTEGER(),

});

var User = connection.define('user',{
  username:sequelize.STRING(),
  hash:sequelize.STRING(),
  salt:sequelize.STRING()
});

var Image = connection.define('image', {
  filename:sequelize.STRING(),

})


Waifu.belongsTo(Personality);
Waifu.belongsTo(Skills);
Waifu.belongsTo(Appearance);
Waifu.belongsTo(Misc);
Waifu.belongsTo(Image);
/*function addWaifu(name_,series_) {
  connection.sync().then(()=>{
    Waifu.create({
      name:name_,
      series:series_
    });
  });
}*/

function unfuckArrays(waifuJSON) {
  let p = JSON.parse('['+waifuJSON.p+']');
  let s = JSON.parse('['+waifuJSON.s+']');
  let a = JSON.parse('['+waifuJSON.a+']');
  let m = JSON.parse('['+waifuJSON.m+']');
  waifuJSON.p=p;
  waifuJSON.s=s;
  waifuJSON.a=a;
  waifuJSON.m=m;
  return waifuJSON;
}

function addWaifu(waifu) {
  console.log("Waifu Data:")
  waifu = unfuckArrays(waifu)
  console.log(waifu);
  connection.sync({force:false}).then(()=>{
    Waifu.create({
      name:waifu.name,
      series:waifu.series
    }).then((waifuModel) => {
      var id = waifuModel.id;
      if(waifu.p != "none") {
        connection.sync().then(() => {
          Personality.create({
	    id:id,
	    caring:waifu.p[0],
            reliable:waifu.p[1],
            entertaining:waifu.p[2],
            impression:waifu.p[3],
          });
        });
      }
      if(waifu.s != "none") {
        connection.sync().then(() => {
          Skills.create({
	    id:id,

            combat:waifu.s[0],
            intelligence:waifu.s[1],
            utility:waifu.s[2],
            family:waifu.s[3],
          });
        });
      }
      if(waifu.a != "none") {
        connection.sync().then(() => {
          Appearance.create({
	    id:id,

            cute:waifu.a[0],
            cool:waifu.a[1],
            breasts:waifu.a[2],
            ass:waifu.a[3],
            attitude:waifu.a[4],
          });
        });
      }
      if(waifu.m != "none") {
        connection.sync().then(() => {
          Misc.create({
	    id:id,

            age:waifu.m[0],
            meme:waifu.p[1],
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

async function addWaifu_(waifu) {
  waifu = unfuckArrays(waifu)
    connection.sync({force:false}).then(()=> {
        let pModel = "none"
        if(waifu.p != "none") {
            pModel = await Personality.create({
                caring:waifu.p[0],
                reliable:waifu.p[1],
                entertaining:waifu.p[2],
                impression:waifu.p[3]
            })
        }
        let sModel = "none"
        if(waifu.s != "none") {
            sModel = await Skills.create({
                combat:waifu.s[0],
                intelligence:waifu.s[1],
                utility:waifu.s[2],
                family:waifu.s[3]
            })
        }
        let aModel = "none"
        if(waifu.a != "none") {
            aModel = await Appearance.create({
                cute:waifu.a[0],
                cool:waifu.a[1],
                breasts:waifu.a[2],
                ass:waifu.a[3],
                attitude:waifu.a[4]
            })
        }
        let mModel = "none"
        if(waifu.m != "none") {
            mModel = await Misc.create({

            })
        }
    )
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

function queryWaifu(name_,p,s,a,m,i) {
  queryList = []
  if(p) queryList.push({model:Personality,as:'personality'})
  if(s) queryList.push({model:Skills,as:'skills'})
  if(a) queryList.push({model:Appearance,as:'appearance'})
  if(m) queryList.push({model:Misc,as:'misc'})
  if(i) queryList.push({model:Image,as:'image'})

  return new Promise(function(resolve,reject) {
    Waifu.findAll({
      include: queryList,
      where: {
  	    name:name_
      }
    }).then(waifus => resolve(waifus[0]))
  })
}

