var chattestControllers = angular.module('chattestControllers', []);

chattestApp.controller('appBody', ['$scope', '$timeout', '$interval',
    'getChatMsgsAndUsers', 'sendChatMsg', 'postCooldown', 'verifyPostContext',
    'messageOps', 'orderOnlineUsers', function ($scope, $timeout,
    $interval, getChatMsgsAndUsers, sendChatMsg, postCooldown,
    verifyPostContext, messageOps, orderOnlineUsers) {
        var online_users = [];
        var online_users_input = [];
        var time_rec_o = {
            value: 0
        };
        var time_ppg = 0;
        var post_cooldown = true;
        $scope.messages = [];
        var post_in_progress = false;

        $scope.c_style_no = 0;
        $scope.l_style_no = 0;
        $scope.a_sound_no = 0;

        /* Controller function definitions */
        function retrieveNow() {
            if(post_in_progress === true) {
                return false;
            }
            post_in_progress = true;
            getChatMsgsAndUsers.async().then(function(d) {
                post_in_progress = false;
                var msg_data = d.data.all;
                online_users_input = d.data.online;
                $scope.online = orderOnlineUsers.
                    updateUserList(online_users_input, online_users);

                //Update message data; added as side effect if any are new
                var any_new = messageOps.addNewMsg(msg_data);
                if (any_new) {
                    playMsgNotification();
                    var display_messages = temp_chatCache.total.slice();
                    $scope.messages = display_messages.reverse();
                    //Showing newest chat messages at the bottom
                }
            }).catch(function(error) {
                post_in_progress = false;
                console.log(error);
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
        
        /* Init function calls (main controller scope) */

        ajaxGetMessage(); //Retrieve messages right after successful login
        $interval(messageOps.updateTimeAgo, 60000);

        /* $scope function definitions */

        $scope.sendMsg = function(e,c) {
            if((e.which === 13 || c === "click")) {
                if(send_msg.value.trim().length === 0) {
                    send_msg.value = "";
                    return false;
                }
                //Anti-spam checking logic; see referenced services for details
                checks = verifyPostContext.verifyLength() && 
                         verifyPostContext.verifyFrequency(post_cooldown) &&
                         verifyPostContext.verifyWordLength();
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
        $scope.showUserList = function() {
            user_list.slideToggle();
        };
        $scope.showMembersPanel = function() {
            if (!window.members_panel.classList.contains("members-panel-visible")) {
                window.members_panel.classList.add("members-panel-visible");
                window.user_list.addClass("user-list-pushed");
            }
            else if (window.members_panel.classList.contains("members-panel-visible")) {
                window.members_panel.classList.remove("members-panel-visible");
                window.user_list.removeClass("user-list-pushed");
            }
        };
        $scope.showPreferences = function() {
           pref_dialog.dialog("open");
        };
        $scope.logoutConfirm = function() {
            logout_dialog.dialog("open");
        };
        $scope.setVolume = function(new_vol) {
            volume_slider.value = new_vol;
            changeVolume();
        };
        $scope.showPopup = function(url, site) {
            var height;
            var width;

            if (site === "google") {
                height = "600";
                width = "1000";
            }
            else if (site === "facebook") {
                height = "350";
                width = "750";
            }
            var popupWindow = window.open(
                url,'popUpWindow','height=' + height +  ',width=' + width +
                    ',left=10,top=10,resizable=yes,scrollbars=yes,' + 
                    'toolbar=yes,menubar=no,location=no,directories=no,' +
                    'status=yes');
        };
        $scope.toggleSocial = function() {
            window.social_options.toggle("slide");
            window.outside_area.toggle();
        };

        //Queries for DOM-changing $scope functions
        $("document").ready( function() {
            $scope.color_prefs = window.all_color_schemes;
            $scope.layout_prefs = window.all_layouts;
            $scope.alert_prefs = window.all_sounds;
        });

        $scope.c_p_model = {
            title: "Color Scheme",
            container: "color-prefs-options",
            collection: "all_color_schemes"
        };
        $scope.l_p_model = {
            title: "Chat Room Layout",
            container: "layout-prefs-options",
            collection: "all_layouts"
        };
        $scope.a_p_model = {
            title: "Message Alert Sound",
            container: "alert-prefs-options",
            collection: "all_sounds"
        };

        //Avoided using ng-class as it requires digest upon scroll
        window.onscroll = function() {
            if (window.scrollY > 630 &&
                !window.side_panel.classList.contains("side-panel-invisible")) {
                window.side_panel.classList.add("side-panel-invisible");
            }
            else if (window.scrollY <= 630 &&
                window.side_panel.classList.contains("side-panel-invisible")) {
                window.side_panel.classList.remove("side-panel-invisible");
            }
        };
}]);