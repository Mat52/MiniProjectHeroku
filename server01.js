//zmienne, stałe

var express = require("express")
var app = express()
var PORT = process.env.PORT || 3000; // bardzo istotna linijka - port zostaje przydzielony przez Heroku

//funkcje na serwerze, obsługujące konkretne adresy
//w przeglądarce
let Check = false
var path = require("path")
var bodyParser = require("body-parser");
const { Cipher } = require("crypto");
app.use(bodyParser.urlencoded({ extended: true }));
let CurrentPage = ""

let users = [
    { id: 1, login: "111", password: "111", wiek: 10, uczen: "checked", plec: "K" },
    { id: 2, login: "222", password: "222", wiek: 11, uczen: "checked", plec: "K" },
    { id: 3, login: "333", password: "333", wiek: 19, uczen: "checked", plec: "M" },
    { id: 4, login: "444", password: "444", wiek: 13, uczen: "", plec: "M" },
    { id: 5, login: "555", password: "555", wiek: 14, uczen: "checked", plec: "K" },
]

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/main.html"))
    CurrentPage = "/static/main.html"
})


app.get("/register", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/register.html"))
    CurrentPage = "/static/register.html"

    app.post("/register", function (req, res) {

        for (var i = 0; i < users.length; i++) {
            if (req.body.login == users[i].login) {
                var html = "<!DOCTYPE html>\n<html>\n    <head>\n    </head>\n <body> \n <h1>Użytkownik o loginie " + req.body.login + " już niestety istnieje </h1> </body>"
                res.send(html)
                return;
            }
        }

        var checkbox = req.body.checkbox
        var age = parseInt(req.body.wiek)
        if (checkbox == undefined) {
            checkbox = ""
        }
        else {
            checkbox = "checked"
        }
        var newPerson = {
            id: users.length + 1,
            login: req.body.login,
            password: req.body.password,
            wiek: age,
            uczen: checkbox,
            plec: req.body.plec
        }
        users.push(newPerson)
        var html = "<!DOCTYPE html>\n<html>\n    <head>\n    </head>\n <body> \n <h1>Witaj " + req.body.login + ", zostałeś poprawnie zarejestrowany</h1> </body>"
        res.send(html)


    })




})

app.get("/admin", function (req, res) {

    if (Check == true) {
        res.sendFile(path.join(__dirname + "/static/admin_access.html"))

    }
    else {
        res.sendFile(path.join(__dirname + "/static/admin_noaccess.html"))
        CurrentPage = "/static/admin_noaccess.html"
    }
})



app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/login.html"))
    CurrentPage = "/static/login.html"


    app.post("/login", function (req, res) {

        for (var i = 0; i < users.length; i++) {
            if (req.body.login == users[i].login && req.body.password == users[i].password) {
                res.redirect("/admin")
                Check = true
                return;
            }
        }

        html = "<!DOCTYPE html>\n<html>\n    <head>\n    </head>\n <body> \n <h1>Nie istnieje konto o podanym loginie lub haśle</h1> </body>"
        res.send(html)
    })



})






app.get("/logout", function (req, res) {
    Check = false
    res.redirect("/")
})


app.get("/sort", function (req, res) {
    if (Check == false) {
        res.sendFile(path.join(__dirname + CurrentPage))
    }

    else {

        var html = "<!DOCTYPE html>\n<html>\n    <head>\n<style>body{background-color:#222831;margin:0;padding:0;}td{border: 1px solid yellow; font-size:25px;color:white;text-align:center;} #nav{height:50px;width:100%;color:white;}#nav>p{padding:0;margin-left:30px;float:left;color:white}#nav>p>a{color:white;}</style>    </head>\n <body> \n <div id='nav'><p><a href='/sort'>sort</a></p><p><a href='/gender'>gender</a></p><p><a href='/show'>show</a></p></div><form action='/sort' method='POST' onchange='this.submit()'><input type='radio' value='mal' name='kolejnosc'><p style='display:inline-block; color:white;font-size:30px; margin-right:20px;'>malejąco</p><input type='radio' value='ros'name='kolejnosc'><p style='display:inline-block; color:white; font-size:30px'>rosnąco</p><table style='width:100%'>"
        for (var i = 0; i < users.length; i++) {
            var adding = "<tr><td style='width:15%; height:50px;'>id: " + users[i].id + "</td><td style='width:40%; height:50px;'>user: " + users[i].login + " - " + users[i].password + "</td><td style='width:15% height:50px;'>wiek: " + users[i].wiek + "</td></tr>"
            html = html + adding
        }
        html = html + "</table></body>"
        res.send(html)
    }

    app.post("/sort", function (req, res) {
        if (req.body.kolejnosc == "mal") {
            users.sort(function (a, b) {
                return a.wiek - b.wiek;
            });
            users.reverse();
            var html = "<!DOCTYPE html>\n<html>\n    <head>\n<style>body{background-color:#222831;margin:0;padding:0;}td{border: 1px solid yellow; font-size:25px;color:white;text-align:center;} #nav{height:50px;width:100%;color:white;}#nav>p{padding:0;margin-left:30px;float:left;color:white}#nav>p>a{color:white;}</style>    </head>\n <body> \n <div id='nav'><p><a href='/sort'>sort</a></p><p><a href='/gender'>gender</a></p><p><a href='/show'>show</a></p></div><form action='/sort' method='POST' onchange='this.submit()'><input type='radio' value='mal' name='kolejnosc' checked><p style='display:inline-block; color:white;font-size:30px; margin-right:20px;'>malejąco</p><input type='radio' value='ros'name='kolejnosc'><p style='display:inline-block; color:white; font-size:30px'>rosnąco</p><table style='width:100%'>"
            for (var i = 0; i < users.length; i++) {
                var adding = "<tr><td style='width:15%; height:50px;'>id: " + users[i].id + "</td><td style='width:40%; height:50px;'>user: " + users[i].login + " - " + users[i].password + "</td><td style='width:15% height:50px;'>wiek: " + users[i].wiek + "</td></tr>"
                html = html + adding
            }
            html = html + "</table></body>"
            res.send(html)



        }
        else {
            users.sort(function (a, b) {
                return a.wiek - b.wiek;
            });
            var html = "<!DOCTYPE html>\n<html>\n    <head>\n<style>body{background-color:#222831;margin:0;padding:0;}td{border: 1px solid yellow; font-size:25px;color:white;text-align:center;} #nav{height:50px;width:100%;color:white;}#nav>p{padding:0;margin-left:30px;float:left;color:white}#nav>p>a{color:white;}</style>    </head>\n <body> \n <div id='nav'><p><a href='/sort'>sort</a></p><p><a href='/gender'>gender</a></p><p><a href='/show'>show</a></p></div><form action='/sort' method='POST' onchange='this.submit()'><input type='radio' value='mal' name='kolejnosc'><p style='display:inline-block; color:white;font-size:30px; margin-right:20px;'>malejąco</p><input type='radio' value='ros'name='kolejnosc' checked><p style='display:inline-block; color:white; font-size:30px'>rosnąco</p><table style='width:100%'>"
            for (var i = 0; i < users.length; i++) {
                var adding = "<tr><td style='width:15%; height:50px;'>id: " + users[i].id + "</td><td style='width:40%; height:50px;'>user: " + users[i].login + " - " + users[i].password + "</td><td style='width:15% height:50px;'>wiek: " + users[i].wiek + "</td></tr>"
                html = html + adding
            }
            html = html + "</table></body>"
            res.send(html)


        }
    })

})

app.get("/gender", function (req, res) {
    if (Check == false) {
        res.sendFile(path.join(__dirname + CurrentPage))
    }
    else {
        var html = "<!DOCTYPE html>\n<html>\n    <head>\n<style>body{background-color:#222831;margin:0;padding:0;}td{height:70px;border: 1px solid yellow; font-size:25px;color:white;text-align:center;width:50%;} #nav{height:50px;width:100%;color:white;}#nav>p{padding:0;margin-left:30px;float:left;color:white}#nav>p>a{color:white;}</style>    </head>\n <body> \n <div id='nav'><p><a href='/sort'>sort</a></p><p><a href='/gender'>gender</a></p><p><a href='/show'>show</a></p></div><table style='width:100%'>"
        for (var i = 0; i < users.length; i++) {
            if (users[i].plec == "K") {
                var adding = "<tr><td>id: " + users[i].id + "</td><td>płeć: " + users[i].plec + "</td></tr>"
                html = html + adding
            }


        }

        html = html + "</table></br><table style='width:100%;margin-top:100px;'>"

        for (var i = 0; i < users.length; i++) {
            if (users[i].plec == "M") {
                var adding = "<tr><td>id: " + users[i].id + "</td><td>płeć: " + users[i].plec + "</td></tr>"
                html = html + adding
            }


        }
        html = html + "</table></body>"
        res.send(html)


    }
})

app.get("/show", function (req, res) {
    if (Check == false) {
        res.sendFile(path.join(__dirname + CurrentPage))
    }
    else {
        var html = "<!DOCTYPE html>\n<html>\n    <head>\n<style>body{background-color:#222831;margin:0;padding:0;}td{border: 1px solid yellow; font-size:25px;color:white;text-align:center;} #nav{height:50px;width:100%;color:white;}#nav>p{padding:0;margin-left:30px;float:left;color:white}#nav>p>a{color:white;}</style>    </head>\n <body> \n <div id='nav'><p><a href='/sort'>sort</a></p><p><a href='/gender'>gender</a></p><p><a href='/show'>show</a></p></div><table style='width:100%'>"
        for (var i = 0; i < users.length; i++) {
            var adding = "<tr><td style='width:15%; height:50px;'>id: " + users[i].id + "</td><td style='width:40%; height:50px;'>user: " + users[i].login + " - " + users[i].password + "</td><td style='width:15%; height:50px;'>uczeń: <input type='checkbox' disabled='disabled' class='checkbox' name='checkbox' " + users[i].uczen + "></td><td style='width:15%; height:50px;'>wiek: " + users[i].wiek + "</td><td style='width:15% height:50px;'>płeć: " + users[i].plec + "</td></tr>"
            html = html + adding
        }
        html = html + "</table></body"
        res.send(html)


    }
})




app.use(express.static('static'))
app.listen(PORT, function () {
    console.log("to jest start serwera na porcie " + PORT)
})