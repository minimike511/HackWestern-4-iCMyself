var watson = require('watson-developer-cloud');
var fs = require('fs');
var visual_recognition = watson.visual_recognition({
    api_key: '0121N-TKK90-18D9D-0A2A0-3DVH1',
    version: 'v3',
    version_date: '2016-05-20'
});

var params = {
    images_file: fs.createReadStream('./resources/obama.jpg')
};

visual_recognition.detectFaces(params,
    function(err, response) {
        if (err)
            console.log(err);
        else
            console.log(JSON.stringify(response, null, 2));
    });

Module.register("watsonvr",{
    // Default module config.
    defaults: {
        text: "Hello World!"
    },

    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.innerHTML = this.config.text;
        return wrapper;
    }
});