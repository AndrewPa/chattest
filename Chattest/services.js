var chattestServices = angular.module('chattestServices', []);

chattestServices.factory('getChatMsg', ['$http', function($http) {
    var promise;
    var getChatMsg = {
        async: function() {
            var url = 'ajax_get_msg.php';

            if(window.temp_chatCache.total[0]) {
                var last_date = getNewestDate();
            }
            else {
                var last_date = "1980-01-01 10:10:10"; 
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
            var url = "send_msg.php";

            var msg_str = send_msg.value;

            url += "?msg=" + encodeURIComponent(msg_str);

            $http.get(url).catch(function(error) {
                 console.log(error);
            });
            send_msg.value = "";
        }
    };
}]);