var chattestServices = angular.module('chattestServices', []);

chattestServices.factory('getChatMsg', ['$http', function($http) {
    var promise;
    var getChatMsg = {
        async: function() {
            var url = 'ajax_get_msg.php';
            var last_date;

            if(window.temp_chatCache.total[0]) {
                last_date = getNewestDate();
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