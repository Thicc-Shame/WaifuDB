window.onload = () => console.log("Waifuu Ajax loaded");

type personality = [number,number,number,number] | "none";
type skill = [number,number,number,number] | "none";
type appearance = [number,number,number,number,number] | "none";
type misc = [number,number] | "none";
type link = string | "none";

class Waifu {
  p : personality;
  s : skill;
  a : appearance;
  m : misc;
  l : link;
  name : string;
  series : string;
  constructor() {
    this.name = (document.getElementById("name") as HTMLInputElement).value;
    this.series = (document.getElementById("series") as HTMLInputElement).value;
    var doPersonality : boolean = (document.getElementById("personalityCheck") as HTMLInputElement).checked;
    var doSkills : boolean = (document.getElementById("skillCheck") as HTMLInputElement).checked;
    var doAppearance : boolean = (document.getElementById("appearanceCheck") as HTMLInputElement).checked;
    var doMisc : boolean = (document.getElementById("miscCheck") as HTMLInputElement).checked;
    var doPic : boolean = (document.getElementById("picCheck") as HTMLInputElement).checked;
    if(doPersonality) {
      var caring = +(document.getElementById("caring") as HTMLInputElement).value;
      var reliable = +(document.getElementById("reliable") as HTMLInputElement).value;
      var entertaining = +(document.getElementById("entertaining") as HTMLInputElement).value;
      var impression = +(document.getElementById("impression") as HTMLInputElement).value;
      this.p = [caring,reliable,entertaining,impression];
    } else {
      this.p = "none";
    }
    if(doSkills) {
      var combat = +(document.getElementById("combat") as HTMLInputElement).value;
      var int = +(document.getElementById("int") as HTMLInputElement).value;
      var utility = +(document.getElementById("utility") as HTMLInputElement).value;
      var family = +(document.getElementById("family") as HTMLInputElement).value;
      this.s = [combat,int,utility,family];
    } else {
      this.s = "none";
    }
    if(doAppearance) {
      var cute = +(document.getElementById("cute") as HTMLInputElement).value;
      var cool = +(document.getElementById("cool") as HTMLInputElement).value;
      var breasts = +(document.getElementById("breasts") as HTMLInputElement).value;
      var ass = +(document.getElementById("ass") as HTMLInputElement).value;
      var attitude = +(document.getElementById("attitude") as HTMLInputElement).value;
      this.a = [cute,cool,breasts,ass,attitude];
    } else {
      this.a = "none";
    }
    if(doMisc) {
      var age = +(document.getElementById("age") as HTMLInputElement).value;
      var meme = +(document.getElementById("meme") as HTMLInputElement).value;
      this.m = [age,meme];
    } else {
      this.m = "none"
    } if(doPic) {
      this.l = (document.getElementById("link") as HTMLInputElement).value;
    } else {
      this.l = "none";
    }
  }

  encode() : string {
    return Object.keys(this).map(key => key + '=' + this[key]).join('&');
  }
}

function sendData() : void {
  console.log("Sending data...");
  var waifu = new Waifu();
  var toSend : string = waifu.encode();
  console.log(toSend);
  var request = new XMLHttpRequest();
  request.open("POST", "/add");
  request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");

  request.send(toSend);


}

function scoreWaifu() : void {
  if((document.getElementById("name") as HTMLInputElement).value != "" && (document.getElementById("series") as HTMLInputElement).value != ""){
    var doPersonality : boolean = (document.getElementById("personalityCheck") as HTMLInputElement).checked;
    var doAppearance : boolean = (document.getElementById("appearanceCheck") as HTMLInputElement).checked;
    var doSkills : boolean = (document.getElementById("skillCheck") as HTMLInputElement).checked;
    var doMisc : boolean = (document.getElementById("miscCheck") as HTMLInputElement).checked;
    var doPic : boolean = (document.getElementById("picCheck") as HTMLInputElement).checked;
    doPersonality? document.getElementById("personalityInput").style.setProperty("display","inline-block") : document.getElementById("personalityInput").style.setProperty("display","none");
    doSkills? document.getElementById("skillsInput").style.setProperty("display","inline-block") : document.getElementById("skillsInput").style.setProperty("display","none");
    doAppearance? document.getElementById("appearanceInput").style.setProperty("display","inline-block") : document.getElementById("appearanceInput").style.setProperty("display","none");
    doMisc? document.getElementById("miscInput").style.setProperty("display","inline-block") : document.getElementById("miscInput").style.setProperty("display","none");
    doPic? document.getElementById("picInput").style.setProperty("display","inline-block") : document.getElementById("picInput").style.setProperty("display","none");
  } else {
    alert("Please fill in name and series!");
  }
}

function validateScoring() : boolean {

  return true;
}

function submitRedirect() : void {
  console.log("Redirecting...");
  var request = new XMLHttpRequest();
  request.open("GET", "/main/submit");
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  request.onreadystatechange = function () {
    console.log("Response html!");
    var newhtml = request.responseText;
    document.getElementById("root").innerHTML = newhtml;
  };
  //var fug = "key=test";
  request.send();
}
