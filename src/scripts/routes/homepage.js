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

        $('#photoForm').submit(function() {
            setLoading(true);
            return false;
        });
    }
};