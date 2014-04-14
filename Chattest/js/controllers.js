var chattestControllers = angular.module('chattestControllers', []);

chattestApp.controller('appBody', ['$scope', '$timeout', '$interval',
    'getChatMsg', 'sendChatMsg', 'postCooldown', 'verifyPostContext',
    'messageOps', 'userInRoom', 'getSessionData', function ($scope, $timeout,
    $interval, getChatMsg, sendChatMsg, postCooldown, verifyPostContext,
    messageOps, userInRoom, getSessionData) {
        var session_username = "";
        var time_rec_o = {
            value: 0
        };
        var time_ppg = 0;
        var post_cooldown = true;
        $scope.messages = [];

        /* Controller function definitions */

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
            if(just_posted !== true) {
                retrieveNow();
                $timeout(ajaxGetMessage, 4000);
                //Using recursive $timeout (i.e. not $interval) to ensure that
                //requests to server occur only after the previous one is complete
            }
            //The following control flow prevents near-simultaneous GET
            //requests, which caused some messages to appear twice on occasion;
            //This also reduces the number of GET requests prompted by messaging
            else if(just_posted === true) {
                if(time_rec < 3.5) {
                    if(time_rec < 0.5) {
                        $timeout(function() { ajaxGetMessage(true) }, 500);
                    } //If messages were already retrieved in the last 0.5
                      //seconds, delay post-prompted retrival by 0.5 seconds
                    else {
                        retrieveNow();
                    } //Proceed if there is more than a 0.5 second time difference
                      //between the recursive and post-prompted GET requests
                }
            }
        }
        
        //Adds placeholder empty objects to force overflow in message area
        //Allows scrolling to bottom of message list upon login
        function initScroll() {
            var message_scaffold = [];
            for(var i=0;i<30;i++) {
                message_scaffold.push({});
            }
            $scope.messages = message_scaffold;
        }
        
        /* Init function calls (main controller scope) */

        initScroll();
        ajaxGetMessage(); //Retrieve messages right after successful login
        $interval(messageOps.updateTimeAgo, 60000);

        /* $scope function definitions */

        $scope.sendMsg = function(e,c) {
            if((e.which === 13 || c === "click")) {
                if(send_msg.value.trim().length === 0) {
                    send_msg.value = "";
                    return false;
                }
                var checks = false;
                //Anti-spam checking logic; see referenced services for details
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