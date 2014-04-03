var chattestControllers = angular.module('chattestControllers', []);

chattestApp.controller('appBody', ['$scope', '$timeout', '$interval', 'getChatMsg',
    'sendChatMsg', function ($scope, $timeout, $interval, getChatMsg, sendChatMsg) {
        $scope.messages = [];
        function ajaxGetMessage(no_recur) {
            getChatMsg.async().then(function(d) {
                var any_new = addNewMsg(d); //Mesages added as side effect if any are new
                if (any_new) {
                    var display_messages = temp_chatCache.total.slice();
                    $scope.messages = display_messages.reverse();
                    //Showing newest chat messages at the bottom
                }
                if(no_recur !== true) {
                    $timeout(ajaxGetMessage, 4000);
                }
                //Using recursive $timeout (i.e. not $interval) to ensure that
                //requests to server occur only after the previous one is complete
            });
        };
        ajaxGetMessage(); //Retrieve messages right after successful login
        $interval(updateTimeAgo, 60000);
        $scope.sendMsg = function(e,c) {
            if (e.which === 13 || c === "click") {
                send_promise = sendChatMsg.sendMsg();
                send_promise.then(function() { ajaxGetMessage(true); } );
                //Retrieves the message the user just sent
                //Passes flag to not start new recursive loop to check for new messages
            };
        };
        $scope.logout = function() {
            window.location = "logout.php";
        };
}]);