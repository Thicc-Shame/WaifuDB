var key = "sauce";
function login() {
    var username = document.getElementById("u").value;
    var password = document.getElementById("p").value;
    console.log(username);
    console.log(password);
    var send = "username=" + username + "&password=" + password; //TODO: ElGamal this
    var request = new XMLHttpRequest();
    request.open("POST", "/login");
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.onreadystatechange = () => {
        console.log("Response...");
        if (request.readyState == 4 && request.status == 202) {
            console.log("Worked");
            go();
        }
        else if (request.status == 405) {
            console.log("Didn't work");
            alert("Incorrect username or password");
        }
    };
    request.send(send);
}
function createAccount() {
    document.getElementById("c").style.display = "block";
    document.getElementById("cl").style.display = "block";
    document.getElementById("loginButton").innerHTML = "Back";
    document.getElementById("loginButton").onclick = back;
    document.getElementById("accountButton").innerHTML = "Submit";
    document.getElementById("accountButton").onclick = submit;
    console.log("Done did");
}
function back() {
    document.getElementById("c").style.display = "none";
    document.getElementById("cl").style.display = "none";
    document.getElementById("accountButton").innerHTML = "Create Account";
    document.getElementById("accountButton").onclick = createAccount;
    document.getElementById("loginButton").innerHTML = "Log in";
    document.getElementById("loginButton").onclick = login;
}
function submit() {
    var p0 = document.getElementById("p").value;
    var p1 = document.getElementById("c").value;
    if (p0 == p1) {
        var username = document.getElementById("u").value;
        var password = document.getElementById("p").value;
        console.log(username);
        console.log(password);
        var send = "username=" + username + "&password=" + password; //TODO: ElGamal this
        var request = new XMLHttpRequest();
        request.open("POST", "/create");
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.send(send);
    }
    else {
        alert("Passwords do not match!");
        return "no";
    }
}
function go() {
    var request = new XMLHttpRequest();
    request.open("GET", "/main/" + key);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.onreadystatechange = function () {
        console.log("Response html!");
        var newhtml = request.responseText;
        document.getElementById("root").innerHTML = newhtml;
    };
    //var fug = "key=test";
    request.send();
}
