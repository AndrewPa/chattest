var chattestApp = angular.module('chattestApp', ['chattestServices', 'chattestControllers']);

var temp_chatCache = {
    total: [],
    new: []
};

window.onload = function() {
    window.chat_msg = document.getElementById("chat-msg");
    window.set_name = document.getElementById("set-name");
    window.send_msg = document.getElementById("send-msg");
    window.message_box = document.getElementById("message-box");
};