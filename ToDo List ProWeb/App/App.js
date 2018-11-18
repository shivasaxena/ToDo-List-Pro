/* Common app functionality */

var app = (function () {
    "use strict";

    var app = {};

    // Common initialization function (to be called from each page)
    app.initialize = function () {
        $('body').append(
            '<div id="notification-message">' +
                '<div class="padding">' +
                    '<div id="notification-message-close"></div>' +
                    '<div id="notification-message-header"></div>' +
                    '<div id="notification-message-body"></div>' +
                '</div>' +
            '</div>');

        $('#notification-message-close').click(function () {
            $('#notification-message').hide();
        });


        // After initialization, expose a common notification function
        app.showNotification = function (header, text) {
            $('#notification-message-header').text(header);
            $('#notification-message-body').text(text);
            $('#notification-message').slideDown('fast');
        };
    };

    return app;
})();

CONSTANTS = {
    "LIST_STATE_KEY": "listState",
    "CLEAR_LIST_ACTION_TRIGGER_KEY": "CLEAR_LIST_ACTION_TRIGGER",
    "CLEAR_LIST_ACTION_MESSAGE": "CLEAR_LIST_ACTION_MESSAGE",
    "DLALOG_MESSAGE_TRIGGER_KEY": "DLALOG_MESSAGE_TRIGGER_KEY",
    "DIALOG_MESSAGE_COMPONENT_CLEAR_BUTTON": "DIALOG_MESSAGE_COMPONENT_CLEAR_BUTTON",
    "OK_MESSAGE_VALUE": "OK",
    "CANCEL_MESSAGE_VALUE": "CANCEL",


};

MessageToDialogBox = {
    "MessageTriggerElement": null,
    "MessageHeading": null,
    "MessageBodyContent": null
};
