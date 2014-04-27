var chattestServices = angular.module('chattestServices', []);

//Gettings messages and online user list in same service to reduce number of POSTs
chattestServices.factory('getChatMsgsAndUsers', ['$http', 'messageOps',
    function($http, messageOps) {
    var promise;
    var getChatMsg = {
        async: function() {
            var last_date;

            if(window.temp_chatCache.total[0]) {
                last_date = messageOps.getNewestDate();
            }
            else {
                last_date = "1980-01-01 10:10:10"; 
            }

            //Returns JSON-encoded results of a single, more efficient MySQL
            //transaction using two tables in the chattest_messages database
            promise = $http.post("php/retrieve_ulist_msgs.php", last_date);

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
            
            send_msg.value = "";

            promise = $http.post("php/send_msg.php", msg_str).catch(function(error) {
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
            send_msg.placeholder = "Please do not flood the room.";
            setTimeout(function() { send_msg.placeholder = ""; }, 3000);
            return false;
        },
        frequencyWarning: function() {
            send_msg.value = "";
            send_msg.placeholder = "Wait 1 second between posts.";
            return false;
        },
        wordLengthWarning: function() {
            send_msg.value = "";
            send_msg.placeholder = "Please do not flood the room.";
            setTimeout(function() { send_msg.placeholder = ""; }, 3000);
            return false;
        }
    };
}]);

chattestServices.service('verifyPostContext', ['postWarnings', function(postWarnings) {
    var self = this;
    this.verifyLength = function() {
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
    };
    this.verifyFrequency = function(post_cooldown) {
        if(!post_cooldown) {
            postWarnings.frequencyWarning();
            return false;
        }
        else {
            return true;
        }
    };
    this.re_cpts = {
        http_unq: "https?:\\/\\/(?:\\w{1,20}\\.)?",
        www_unq: "www\\.",
        common: "\\w{1,70}\\.\\w{1,20}(?:\\.\\w{1,20})?" +
                "(?:\\/(?:\\w*\\/*)?.*?(?:\\s|$|\\W$|\\W\\s|\\W\\W))?"
    };
    this.url_re = new RegExp(self.re_cpts['http_unq'] + self.re_cpts['common'] +
        "|" + self.re_cpts['www_unq'] + self.re_cpts['common']);
    this.verifyWordLength = function() {
        var user_msg = send_msg.value.slice();
        var user_msg_nolink = user_msg.replace(self.url_re, "");
        var msg_arr = user_msg_nolink.trim().split(/\s/);

        for (var i=0;i<msg_arr.length;i++) {
            if (msg_arr[i].length > 50) {
                postWarnings.wordLengthWarning();
                return false;
            }
        }
        return true;
    };
}]);

chattestServices.service('messageOps', [function() {
    var self = this;
    this.getNewestDate = function() {
        //Returns date of the latest received chat message
        var cache = window.temp_chatCache.total;
        var last_date = cache[0].dt.msg_dt;

        return last_date;
    };
    this.addNewMsg = function(r_data) {
        //Returns "true" if there are any new messages
        //Also adds new messages to cache as a side-effect, if new messages exist
        window.temp_chatCache.new = r_data;
        var new_msg = window.temp_chatCache.new;
        if(new_msg !== undefined && new_msg[0]) {
            for(var i=0;i<new_msg.length;i++) {
                new_msg[i].dt = { 
                    msg_dt: new_msg[i].dt,
                    dt_ago: moment(new_msg[i].dt).
                        subtract('seconds',30). //Offset rounding errors
                        from(self.getGMT())
                };
                new_msg[i].msg = self.parseLinks(new_msg[i].msg);
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
    };
    //Add additional formatting to the datetime property with Moment.js
    this.updateTimeAgo = function() {
        var all_msg = window.temp_chatCache.total;
        for(var i=0;i<all_msg.length;i++) {
            var cur_msg_dt = all_msg[i].dt;
            cur_msg_dt.dt_ago = moment(cur_msg_dt.msg_dt).
                from(self.getGMT());
        }
    };
    this.getGMT = function() {
         var tz_offset = moment().zone();
         return now_gmt = moment().add('minutes', tz_offset);
    };
    this.recurCycleTime = function(just_posted, time_rec) {
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
    };
    this.re_cpts = {
        http_unq: "https?:\\/\\/(?:\\w{1,20}\\.)?",
        www_unq: "www\\.",
        common: "\\w{1,70}\\.\\w{1,20}(?:\\.\\w{1,20})?" +
                "(?:\\/(?:\\w*\\/*)?.*?(?:\\s|$|\\W$|\\W\\s|\\W\\W))?"
    };
    this.url_re = new RegExp(self.re_cpts['http_unq'] + self.re_cpts['common'] +
        "|" + self.re_cpts['www_unq'] + self.re_cpts['common']);
    this.parseLinks = function(new_msg_i) {
        var parsed_urls = new_msg_i.match(self.url_re, "g");

        if (!parsed_urls) {
            return new_msg_i;
        }

        for (var i=0;i<parsed_urls.length;i++) {
            var url = parsed_urls[i].trim();
            var url_no_suf = url.substr(0, url.length-2);
            var suffix = url.substr(url.length-2, url.length);
            var suffix_cor = suffix.replace(/\W\W|\w\W/g, "");
            var suffix_rem = suffix.replace(/\w\w|\W\w/g, "");

            if (!url.match(/https?:\/\//)) {
                var prefix = "//";
            } 
            else {
                prefix = "";
            }

            new_msg_i = new_msg_i.replace(url, '<a href="' + prefix +
                url_no_suf + suffix_cor + '" target="_blank"><em>' +
                '(link)</em></a>' + suffix_rem);
        }
        return new_msg_i;
    };
}]);

//Maintains the order of the online users list, from first in to last in
chattestServices.factory('orderOnlineUsers', [function() {
    return {
        updateUserList: function(online_users_input, online_users) {
            var online_users_input_strings = [];
            for(var i=0;i<online_users_input.length;i++) {
                online_users_input_strings.push(online_users_input[i].name);
            }
            for(var i=0;i<online_users_input_strings.length;i++) {
                if(online_users.indexOf(online_users_input_strings[i]) === -1) {
                    online_users.push(online_users_input_strings[i]);
                }
            }
            for(var i=0;i<online_users.length;i++) {
                if(online_users_input_strings.indexOf(online_users[i]) === -1) {
                    online_users.splice(i,1);
                }
            }
            return online_users;
        }
    };
}]);