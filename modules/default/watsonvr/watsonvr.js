/*var watson = require('watson-developer-cloud');
var fs = require('fs');
var visual_recognition = watson.visual_recognition({
    api_key: '0121N-TKK90-18D9D-0A2A0-3DVH1',
    version: 'v3',
    version_date: '2016-05-20'
});*/


Module.register("watsonvr", {
    // Default module config.
    defaults: {
        text: "abc"
    },

    // Define required scripts.
    getScripts: function() {
        return ["watson-developer-cloud.js", "fs.js"];
    },

    // Override dom generator.
    getDom: function () {
        Log.info("RUNNING VISUAL RECOG");
        var wrapper = document.createElement("div");
        var visual_recognition = watson.visual_recognition({
            api_key: '0121N-TKK90-18D9D-0A2A0-3DVH1',
            version: 'v3',
            version_date: '2016-05-20'
        });

        try {
            var params = {
                images_file: fs.createReadStream('./db/obama.jpg')
            };


            visual_recognition.detectFaces(params, function (err, response) {
                if (err) {
                    Log.info(err);
                } else {
                    wrapper.innerHTML = JSON.stringify(response, null, 2);
                }
            });
        } catch (e) {
            Log.info(e);
        }

        // wrapper.innerHTML = this.config.text;
        // wrapper.innerHTML = Math.random();
        return wrapper;
    },
    start: function () {
        var self = this;
        setInterval(function () {
            self.updateDom(); // no speed defined, so it updates instantly.
        }, 1000); //perform every 1000 milliseconds.
    },
});