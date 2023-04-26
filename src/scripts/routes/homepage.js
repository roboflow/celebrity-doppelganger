const page = require("page");

module.exports = function(state) {
    return function (ctx, next) {
        var template = require("../../templates/homepage.hbs");
        $("body").html(template({
            apiKey: state.apiKey
        }));

        var error = function(message) {
            $('#errorMessage').html("Error: " + message).removeClass("hidden");
            return false;
        };

        var setLoading = function(loading) {
            if(loading) {
                $('#submitButtonContainer').addClass("hidden");
                $('#loadingContainer').removeClass("hidden");
            } else {
                $('#submitButtonContainer').removeClass("hidden");
                $('#loadingContainer').addClass("hidden");
            }
        };

        $('#photo').change(function() {
            $('#errorMessage').addClass("hidden");
        });

        $('#photoForm').submit(function() {
            setLoading(true);

            var file = $('#photo').get(0).files[0];
            if(!file) {
                $('#errorMessage').html("Please select a file").removeClass("hidden");
                setLoading(false);
                return false;
            }

            loadImage(file, function(img, data) {
                var base64 = img.toDataURL("image/jpeg");
                debugger;
             }, {
                maxWidth: 1024,
                maxHeight: 1024,
                contain: true,
                canvas: true,
                meta: true,
                noRevoke: true,
                crossOrigin: true
            });

            return false;
        });
    }
};