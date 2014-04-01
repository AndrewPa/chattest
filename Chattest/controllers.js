var chattestControllers = angular.module('chattestControllers', []);

chattestApp.controller('appBody', ['$scope', '$interval', 'getChatMsg',
    'sendChatMsg', function ($scope, $interval, getChatMsg, sendChatMsg) {
        $scope.messages = [];
        function ajaxGetMessage() {
            getChatMsg.async().then(function(d) {
                var any_new = addNewMsg(d); //Mesages added as side effect if any are new
                if (any_new) {
                    var display_messages = temp_chatCache.total.slice();
                    $scope.messages = display_messages.reverse();
                    //Showing newest chat messages at the bottom
                }
            });
        };
        ajaxGetMessage(); //Retrieve messages right after successful login
        $interval(ajaxGetMessage, 4000);
        $scope.sendMsg = function(e,c) {
            if (e.which === 13 || c === "click") {
                send_promise = sendChatMsg.sendMsg();
                send_promise.then(ajaxGetMessage);
            };
        };
        $scope.logout = function() {
            window.location = "logout.php";
        };
}]);