var chattestControllers = angular.module('chattestControllers', []);

chattestApp.controller('appBody', ['$scope', '$timeout', '$interval',
    'getChatMsg', 'sendChatMsg', 'postCooldown', 'verifyPostContext',
    'messageOps', function ($scope, $timeout, $interval, getChatMsg,
    sendChatMsg, postCooldown, verifyPostContext, messageOps) {
        var time_rec_o = {
            value: 0
        };
        var time_ppg = 0;
        var post_cooldown = true;
        $scope.messages = [];

        function retrieveNow() {
            getChatMsg.async().then(function(d) {
                var any_new = messageOps.addNewMsg(d); //Mesages added as side effect if any are new
                if (any_new) {
                    var display_messages = temp_chatCache.total.slice();
                    $scope.messages = display_messages.reverse();
                    //Showing newest chat messages at the bottom
                }
            });
        }

        function ajaxGetMessage(just_posted) {
            time_rec = messageOps.recurCycleTime(just_posted, time_rec_o);
            //Returns time since last recursive (not post-prompted) message retrieval
            if(just_posted !== true | (just_posted === true && time_rec < 3.5)) {
                //Prevents near-simultaneous GET requests, which caused
                //some messages to appear twice on occasion
                //Also reduces the number of GET requests prompted by messaging
                if(just_posted === true && time_rec < 0.5) {
                    $timeout(function() { ajaxGetMessage(true) }, 500);
                    return false;
                } //Delay GET request if too soon in 4-second retrieval cycle 
            }
            retrieveNow();
            if(just_posted !== true) {
                $timeout(ajaxGetMessage, 4000);
            }
            //Using recursive $timeout (i.e. not $interval) to ensure that
            //requests to server occur only after the previous one is complete
        };

        ajaxGetMessage(); //Retrieve messages right after successful login
        $interval(messageOps.updateTimeAgo, 60000);

        $scope.sendMsg = function(e,c) {
            if((e.which === 13 || c === "click")) {
                var checks = false;
                if (verifyPostContext.verifyLength()) { 
                    checks = verifyPostContext.verifyFrequency(post_cooldown)
                }
                if(checks) {
                    post_cooldown = false;
                    postCooldown.beginCooldown().then(function(cooled) {
                        post_cooldown = cooled;
                    });
                    send_promise = sendChatMsg.sendMsg();
                    send_promise.then(function() { ajaxGetMessage(true); } );
                    //Retrieves the message the user just sent
                    //Passes flag to not start new recursive loop to check for new messages
                }
            };
        };
        $scope.logout = function() {
            window.location = "logout.php";
        };
}]);