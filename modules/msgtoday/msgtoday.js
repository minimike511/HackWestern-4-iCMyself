Module.register("msgtoday", {

    // Module config defaults.
    defaults: {
        printName: "Handsome",
        compliments: {
            anytime: [
                "Hey there sexy!"
            ],
            anytime: [
                "Good morning, %NAME%!",
                "Hi %NAME%! Enjoy your day!",
                "How was your sleep %NAME%?"
            ],
            afternoon: [
                "Hello %NAME%!",
                "You look sexy %NAME%!!",
                "Looking good today %NAME%!!"
            ],
            evening: [
                "Wow, you look hot!",
                "You look nice %NAME%!!",
                "Hi, sexy! Good evening!"
            ],
            rain: [
                "Hey %NAME%! It's going to rain today, remember to bring an umbrella!!!"
            ],
            snow: [
                "Expect some snow drops %NAME%! The WINTER HAS COME!"
            ],
            cold: [
                "Brrrr... It's cold outside %NAME%!, warm up your car first."
            ],
            hot: [
                "It's really hot outside %NAME%! Make sure to drink a lot of water!"
            ]
        },
        updateInterval: 30000,
        remoteFile: null,
        fadeSpeed: 4000
    },

    // Set currentweather from module
    currentWeatherType: "sun",

    // Define required scripts.
    getScripts: function () {
        return ["moment.js"];
    },

    // Define start sequence.
    start: function () {
        Log.info("Starting module: " + this.name);
        Log.log("detected" + this.config.printName);

        this.lastComplimentIndex = -1;

        this.updateWeather((weather) => {
            this.currentWeatherType = weather;
        var self = this;
        setTimeout(function (args) {
            self.updateDom()
        }, 1000);
    });

        /*if (this.config.remoteFile != null) {
            this.complimentFile((response) => {
                this.config.compliments = JSON.parse(response);
            });
        }*/

        /*this.updateWeather((response) => {
            this.currentWeatherType = response;
        });*/

        // Schedule update timer.
        var self = this;
        setInterval(function () {
            self.updateDom(self.config.fadeSpeed);
        }, this.config.updateInterval);
    },

    /* randomIndex(compliments)
     * Generate a random index for a list of compliments.
     *
     * argument compliments Array<String> - Array with compliments.
     *
     * return Number - Random index.
     */
    randomIndex: function (compliments) {
        if (compliments.length === 1) {
            return 0;
        }

        var generate = function () {
            return Math.floor(Math.random() * compliments.length);
        };

        var complimentIndex = generate();

        while (complimentIndex === this.lastComplimentIndex) {
            complimentIndex = generate();
        }

        this.lastComplimentIndex = complimentIndex;

        return complimentIndex;
    },

    /* complimentArray()
     * Retrieve an array of compliments for the time of the day.
     *
     * return compliments Array<String> - Array with compliments for the time of the day.
     */
    complimentArray: function () {
        var hour = moment().hour();
        var compliments;

        if (hour >= 3 && hour < 12 && this.config.compliments.hasOwnProperty("morning")) {
            compliments = this.config.compliments.morning.slice(0);
        } else if (hour >= 12 && hour < 17 && this.config.compliments.hasOwnProperty("afternoon")) {
            compliments = this.config.compliments.afternoon.slice(0);
        } else if (this.config.compliments.hasOwnProperty("evening")) {
            compliments = this.config.compliments.evening.slice(0);
        }

        if (typeof compliments === "undefined") {
            compliments = new Array();
        }

        if (this.currentWeatherType in this.config.compliments) {
            //compliments.push.apply(compliments, this.config.compliments[this.currentWeatherType]);
            compliments = this.config.compliments[this.currentWeatherType];
            var replacements = {"%NAME%": this.config.printName};
            for (var i = 0; i < compliments.length; i++) {
                compliments[i] = compliments[i].replace(/%\w+%/g, function (all) {
                    return replacements[all] || all;
                });
            }
            return compliments;
        }

        compliments.push.apply(compliments, this.config.compliments.anytime);

        var replacements = {"%NAME%": this.config.printName};
        for (var i = 0; i < compliments.length; i++) {
            compliments[i] = compliments[i].replace(/%\w+%/g, function (all) {
                return replacements[all] || all;
            });
        }

        return compliments;
    },

    /* complimentFile(callback)
     * Retrieve a file from the local filesystem
     */
    updateWeather: function (gotWeather) {

        var weatherUpdate = new XMLHttpRequest();
        //weatherUpdate.overrideMimeType("application/json");
        weatherUpdate.open("GET", "https://hackathon.pic.pelmorex.com/api/data/shortterm?locationcode=CAON0383", true);
        weatherUpdate.onreadystatechange = function () {
            if (weatherUpdate.status == "200" && weatherUpdate.readyState == 4) {
                var jsonData = JSON.parse(weatherUpdate.responseText);
                for (var i = 0; i < 4; i++) {
                    if (jsonData.data[i].rain >= 2) {
                        gotWeather("rain");
                        return;
                    } else if (jsonData.data[i].snow >= 5) {
                        gotWeather("snow");
                        return;
                    } else if (jsonData.data[i].tempMax >= 30) {
                        gotWeather("hot");
                        return;
                    }
                    else if (jsonData.data[i].tempMin <= -10) {
                        gotWeather("cold");
                        return;
                    }
                }
                gotWeather("sun");
            }
        };
        weatherUpdate.send();
    },

    /* complimentArray()
     * Retrieve a random compliment.
     *
     * return compliment string - A compliment.
     */
    randomCompliment: function () {
        var compliments = this.complimentArray();
        var index = this.randomIndex(compliments);

        return compliments[index];
    },

    // Override dom generator.
    getDom: function () {
        var complimentText = this.randomCompliment();
        var compliment = document.createTextNode(complimentText);
        var wrapper = document.createElement("div");
        wrapper.className = this.config.classes ? this.config.classes : "thin xlarge bright";
        wrapper.appendChild(compliment);

        return wrapper;
    },


    // From data currentweather set weather type
    setCurrentWeatherType: function (data) {
        var weatherIconTable = {
            "01d": "day_sunny",
            "02d": "day_cloudy",
            "03d": "cloudy",
            "04d": "cloudy_windy",
            "09d": "showers",
            "10d": "rain",
            "11d": "thunderstorm",
            "13d": "snow",
            "50d": "fog",
            "01n": "night_clear",
            "02n": "night_cloudy",
            "03n": "night_cloudy",
            "04n": "night_cloudy",
            "09n": "night_showers",
            "10n": "night_rain",
            "11n": "night_thunderstorm",
            "13n": "night_snow",
            "50n": "night_alt_cloudy_windy"
        };
        //this.currentWeatherType = weatherIconTable[data.weather[0].icon];
        this.currentWeatherType = "rain";
    },


    // Override notification handler.
    notificationReceived: function (notification, payload, sender) {
        if (notification == "CURRENTWEATHER_DATA") {
            this.setCurrentWeatherType(payload.data);
        }
    },

});