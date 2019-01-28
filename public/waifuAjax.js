window.onload = () => console.log("Waifuu Ajax loaded");
class Waifu {
    constructor() {
        this.name = document.getElementById("name").value;
        this.series = document.getElementById("series").value;
        var doPersonality = document.getElementById("personalityCheck").checked;
        var doSkills = document.getElementById("skillCheck").checked;
        var doAppearance = document.getElementById("appearanceCheck").checked;
        var doMisc = document.getElementById("miscCheck").checked;
        var doPic = document.getElementById("picCheck").checked;
        if (doPersonality) {
            var caring = +document.getElementById("caring").value;
            var reliable = +document.getElementById("reliable").value;
            var entertaining = +document.getElementById("entertaining").value;
            var impression = +document.getElementById("impression").value;
            this.p = [caring, reliable, entertaining, impression];
        }
        else {
            this.p = "none";
        }
        if (doSkills) {
            var combat = +document.getElementById("combat").value;
            var int = +document.getElementById("int").value;
            var utility = +document.getElementById("utility").value;
            var family = +document.getElementById("family").value;
            this.s = [combat, int, utility, family];
        }
        else {
            this.s = "none";
        }
        if (doAppearance) {
            var cute = +document.getElementById("cute").value;
            var cool = +document.getElementById("cool").value;
            var breasts = +document.getElementById("breasts").value;
            var ass = +document.getElementById("ass").value;
            var attitude = +document.getElementById("attitude").value;
            this.a = [cute, cool, breasts, ass, attitude];
        }
        else {
            this.a = "none";
        }
        if (doMisc) {
            var age = +document.getElementById("age").value;
            var meme = +document.getElementById("meme").value;
            this.m = [age, meme];
        }
        else {
            this.m = "none";
        }
        if (doPic) {
            this.l = document.getElementById("link").value;
        }
        else {
            this.l = "none";
        }
    }
    encode() {
        return Object.keys(this).map(key => key + '=' + this[key]).join('&');
    }
}
function sendData() {
    console.log("Sending data...");
    var waifu = new Waifu();
    var toSend = waifu.encode();
    console.log(toSend);
    var request = new XMLHttpRequest();
    request.open("POST", "/add");
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send(toSend);
}
function scoreWaifu() {
    if (document.getElementById("name").value != "" && document.getElementById("series").value != "") {
        var doPersonality = document.getElementById("personalityCheck").checked;
        var doAppearance = document.getElementById("appearanceCheck").checked;
        var doSkills = document.getElementById("skillCheck").checked;
        var doMisc = document.getElementById("miscCheck").checked;
        var doPic = document.getElementById("picCheck").checked;
        doPersonality ? document.getElementById("personalityInput").style.setProperty("display", "inline-block") : document.getElementById("personalityInput").style.setProperty("display", "none");
        doSkills ? document.getElementById("skillsInput").style.setProperty("display", "inline-block") : document.getElementById("skillsInput").style.setProperty("display", "none");
        doAppearance ? document.getElementById("appearanceInput").style.setProperty("display", "inline-block") : document.getElementById("appearanceInput").style.setProperty("display", "none");
        doMisc ? document.getElementById("miscInput").style.setProperty("display", "inline-block") : document.getElementById("miscInput").style.setProperty("display", "none");
        doPic ? document.getElementById("picInput").style.setProperty("display", "inline-block") : document.getElementById("picInput").style.setProperty("display", "none");
    }
    else {
        alert("Please fill in name and series!");
    }
}
function validateScoring() {
    return true;
}
function submitRedirect() {
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
