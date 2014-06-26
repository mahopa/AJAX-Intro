weatherApp = {};
weatherApp.weathers = [];
weatherApp.urlbase = "alextestapp";
weatherApp.URLMaker = function (base, directories) {
    var holder = "https://";
    if (base) {
        holder += base + ".firebaseio.com/";
    }
    else {
        holder += weatherApp.urlbase + ".firebaseio.com/";
    }
    if (directories) {
        holder += directories.join("/");
    }
    holder += ".json";
    console.log(holder);
    return holder;
};
///Our generalized AJAX CAll
weatherApp.Ajax = function (/*Method notes?*/method, URL, data, success, failure) {
    var request = new XMLHttpRequest();
    request.open(method, URL);
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            if (typeof success === 'function') {
                success(this.response);
            }
        }
        else {
            if (typeof failure === 'function') {
                failure();
            }
            else {
                console.log("Error on " + method + " to " + URL + ": " + this.response);
            }
        }
    };
    request.onerror = function () {
        if (typeof failure === 'function') {
            failure();
        }
    };
    request.send(data);
};
weatherApp.addWeather = function () {
    "use strict";
    var weatherObject = {};
    weatherObject.temp = document.getElementById("temperature").value;
    weatherObject.city = document.getElementById("city").value;
    var request = new XMLHttpRequest();
    request.open("POST", weatherApp.URLMaker(), true);
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            //Call Worked. Very Success. Much Win.
            console.log(this.response);
            weatherApp.showWeather();
        }
        else {
            //Oh Noes you got a server error
            console.log("Error on POST: " + this.response);
        }
    };
    request.onerror = function () {
        //This is where Communication or transport error are handled
        console.log("Communication Error on POST");
    };
    request.send(JSON.stringify(weatherObject));

};
weatherApp.showWeather = function () {
    //Get Goes Here
    console.log("show called");
    var request = new XMLHttpRequest();
    request.open("GET", weatherApp.URLMaker());
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            //Do success things
            var data = JSON.parse(this.response);
            weatherApp.weathers = [];
            for (var w in data) {
                data[w].key = w;
                weatherApp.weathers.push(data[w]);
            }
            weatherApp.writeOutput();
        }
        else {
            console.log("Server Errror on GET: " + this.response);
        }
    };
    request.onerror = function () {
        console.log("Errr on GET");
    };
    request.send();
};
weatherApp.writeOutput = function () {
    //Ouputs data from the array to the output div
    holder = "";
    for (var w in weatherApp.weathers) {
        holder += weatherApp.weathers[w].city +
            ": <button onclick='weatherApp.Delete(\"" + weatherApp.weathers[w].key + "\")'>Delete</button><br/>";
    }
    document.getElementById("output").innerHTML = holder;
};
weatherApp.DeleteTarget = function () {
    var urlTarget = document.getElementById("url-target").value;
    var url = weatherApp.url + urlTarget + "/.json";
    var request = new XMLHttpRequest();
    request.open("DELETE", weatherApp.URLMaker(null, [urlTarget]));
    request.send();
};
weatherApp.Delete = function (urlTarget) {
    var request = new XMLHttpRequest();
    request.open("DELETE", weatherApp.URLMaker(null, [urlTarget]));
    request.onload = function () { weatherApp.showWeather(); };
    request.send();
};
weatherApp.showWeather();