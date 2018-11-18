// The initialize function must be run each time a new page is loaded.
(function () {
    Office.initialize = function (reason) {

        console.log(Utilities);
        Utilities.setTheme("GREEN");

    };
})();