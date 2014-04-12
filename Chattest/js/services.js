var chattestServices = angular.module('chattestServices', []);

chattestServices.factory('getChatMsg', ['$http', 'messageOps',
    function($http, messageOps) {
    var promise;
    var getChatMsg = {
        async: function() {
            var url = 'ajax_get_msg.php';
            var last_date;

            if(window.temp_chatCache.total[0]) {
                last_date = messageOps.getNewestDate();
            }
            else {
                last_date = "1980-01-01 10:10:10"; 
            }
            url += "?ld=" + encodeURIComponent(last_date);

            promise = $http.get(url).then(function(response) {
                return response;
            }).
            catch(function(error) {
                 console.log(error);
            });;
            return promise;
        }
    };
    return getChatMsg;
}]);

chattestServices.factory('sendChatMsg', ['$http', function($http) {
    return {
        sendMsg: function() {
            var promise;
            var msg_str = send_msg.value;
            msg_str = msg_str.trim();
            
            if(msg_str.length === 0) {
                send_msg.value = "";
                return false;
            }

            send_msg.value = "";

            promise = $http.post("send_msg.php", msg_str).catch(function(error) {
                 console.log(error);
            });
            return promise;
        }
    };
}]);

//Initiates one-second cooldown for each post to prevent spamming
chattestServices.factory('postCooldown', ['$q', function($q) {
    return {
        beginCooldown: function(post_cooldown) {
            var deferred = $q.defer();
            time_ppg = 0;
            var timer_ppg = setInterval(function() {
                time_ppg += 0.25;
                if(time_ppg >= 1) {
                    clearInterval(timer_ppg);
                    send_msg.placeholder = "";
                    deferred.resolve(true);
                }
            }, 250);
            return deferred.promise;
        }
    };
}]);

chattestServices.factory('postWarnings', [function() {
    return {
        lengthWarning: function() {
            send_msg.value = "";
            send_msg.placeholder = "Please do not attempt to spam the chat room.";
            setTimeout(function() { send_msg.placeholder = ""; }, 2000);
            return false;
        },
        frequencyWarning: function() {
            send_msg.value = "";
            send_msg.placeholder = "Please wait one second before posting another message.";
            return false;
        }
    };
}]);

chattestServices.factory('verifyPostContext', ['postWarnings', function(postWarnings) {
    return {
        verifyLength: function() {
            if(send_msg.value.length > 500) {
                postWarnings.lengthWarning();
                return false;
            }
            else if (send_msg.value.length < 1) {
                return false;
            }
            else {
                return true;
            }
        },
        verifyFrequency: function(post_cooldown) {
            if(!post_cooldown) {
                postWarnings.frequencyWarning();
                return false;
            }
            else {
                return true;
            }
        }
    };
}]);

chattestServices.factory('messageOps', [function() {
    var message_ops = {
        getNewestDate: function() {
            //Returns date of the latest received chat message
            var cache = window.temp_chatCache.total;
            var last_date = cache[0].dt.msg_dt;

            return last_date;
        },
        addNewMsg: function(r_data) {
            //Returns "true" if there are any new messages
            //Also adds new messages to cache as a side-effect, if new messages exist
            window.temp_chatCache.new = r_data.data.all;
            var new_msg = window.temp_chatCache.new;
            if(new_msg !== undefined && new_msg[0]) {
                for(var i=0;i<new_msg.length;i++) {
                    new_msg[i].dt = { 
                        msg_dt: new_msg[i].dt,
                        dt_ago: moment(new_msg[i].dt).
                                subtract('seconds',30). //Offset rounding errors
                                from(message_ops.getGMT())
                    };
                }

                //Handles the addition of new messages to the temporary storage object
                var all_msg = window.temp_chatCache.total;
                var merged = new_msg.concat(all_msg);
                window.temp_chatCache.total = merged;
                window.temp_chatCache.new = [];
                window.temp_chatCache.total.splice(30,all_msg.length);
                return true;
            }
            return false; //No new chat messages
        },
        //Add additional formatting to the datetime property with Moment.js
        updateTimeAgo: function() {
            var all_msg = window.temp_chatCache.total;
            for(var i=0;i<all_msg.length;i++) {
                var cur_msg_dt = all_msg[i].dt;
                cur_msg_dt.dt_ago = moment(cur_msg_dt.msg_dt).
                        from(messageOps.getGMT());
            }
        },
        getGMT: function() {
             var tz_offset = moment().zone();
             return now_gmt = moment().add('minutes', tz_offset);
        },
        recurCycleTime: function(just_posted, time_rec) {
            if(just_posted !== true) {
                var timer_rec = setInterval(function() {
                    called = true;
                    time_rec.value += 0.5;
                    if(time_rec.value === 4) {
                        clearInterval(timer_rec);
                        time_rec.value = 0;
                    }
                }, 500);
                //Counts time in 4-second cycle since last recursive call
            }
            return time_rec.value;
        }
    };
    return message_ops;
}]);