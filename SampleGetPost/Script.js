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
                failure(this.response);
            }
            else {
                console.log("Error on " + method + " to " + URL + ": " + this.response);
            }
        }
    };
    request.onerror = function () {
        if (typeof failure === 'function') {
            failure(this.readyState + "Com Error");
        }
    };
    request.send(JSON.stringify(data));
};

weatherApp.AjaxGet = function (URL, success, failure) {
    weatherApp.Ajax("GET", URL, null, success, failure);
}
weatherApp.addWeather = function () {
    "use strict";
    var weatherObject = {};
    weatherObject.temp = document.getElementById("temperature").value;
    weatherObject.city = document.getElementById("city").value;

    weatherApp.Ajax("POST", weatherApp.URLMaker(), weatherObject, weatherApp.showWeather, console.log);

};
weatherApp.showWeather = function () {
    //Get Goes Here
    console.log("show called");

    weatherApp.Ajax(
        "GET", 
        weatherApp.URLMaker(),
        null,
        function (data) {
            data = JSON.parse(data);
            weatherApp.weathers = [];
            for (var w in data) {
                data[w].key = w;//Puts key into the object before storing it in the array
                weatherApp.weathers.push(data[w]);
            }
            weatherApp.writeOutput();
        }
        );


};
weatherApp.writeOutput = function () {
    //Ouputs data from the array to the output div
    holder = "";
    for (var w in weatherApp.weathers) {
        holder += weatherApp.weathers[w].city +
            ": <button onclick='weatherApp.Delete(\"" + weatherApp.weathers[w].key + "\")'>Delete</button>" +
            "<button onclick='weatherApp.Update(" + w + ")'>Update</button><br/>";
    }
    document.getElementById("output").innerHTML = holder;
};
weatherApp.saveUpdate = function (index) {
    weatherApp.weathers[index].city = document.getElementById("edit-city").value;
    weatherApp.weathers[index].temp = document.getElementById("edit-temp").value;

    weatherApp.Ajax(
        "PATCH",
        weatherApp.URLMaker(null, [weatherApp.weathers[index].key]),
        {
            temp: document.getElementById("edit-temp").value,
            city: document.getElementById("edit-city").value
        },
        weatherApp.showWeather,
        console.log
        );

};
weatherApp.Update = function (index) {

    var updating = weatherApp.weathers[index];
    var holder = "<input type='text' id='edit-city' value='" + updating.city + "' />";
    holder += "<input type='text' id='edit-temp' value='" + updating.temp + "' />";
    holder += "<button onclick='weatherApp.saveUpdate(" + index + ")'>Save</button>";
    holder += "<button onclick='weatherApp.showWeather()'>Cancel</button>";

    document.getElementById("output").innerHTML = holder;
};
weatherApp.Delete = function (urlTarget) {
    weatherApp.Ajax(
        "DELETE",
        weatherApp.URLMaker(null, [urlTarget]),
        null,
        weatherApp.showWeather,
        function (data) { console.log(data) }
        );
};
weatherApp.showWeather();