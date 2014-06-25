weatherApp = {};
weatherApp.weathers = [];
weatherApp.url = "https://alextestapp.firebaseio.com/";
weatherApp.addWeather = function () {
    "use strict";
    //Post Goes Here
    var weatherObject = {};
    weatherObject.temp = document.getElementById("temperature").value;
    weatherObject.city = document.getElementById("city").value;
    var request = new XMLHttpRequest();
    request.open("POST", weatherApp.url, true);
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
    request.open("GET", weatherApp.url);
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
        holder += weatherApp.weathers[w].city + ": " + weatherApp.weathers[w].key + "<br/>";
    }
    document.getElementById("output").innerHTML = holder;
};
weatherApp.DeleteTarget = function () {
    var urlTarget = document.getElementById("url-target").value;
    var url = weatherApp.url + urlTarget + "/.json";
    var request = new XMLHttpRequest();
    request.open("DELETE", url);
    request.send();
};
//weatherApp.showWeather();