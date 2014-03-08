var chattestServices = angular.module('chattestServices', []);

chattestServices.factory('getChatMsg', ['$http', function($http) {
    var promise;
    var getChatMsg = {
        async: function() {
            var url = 'ajax_get_msg.php';

            if(window.temp_chatCache.chatData) {
                var last_date = getNewestDate();
            }
            else {
                var last_date = "1980-01-01 10:10:10"; 
            }
            url += "?ld=" + encodeURIComponent(last_date);

            //if (promises.getChatMsg === "resolved") {
                //promises.getChatMsg = "unresolved";
                promise = $http.get(url).then(function(response) {
                    return response;
                });
            //}
            return promise;
        }
    };
    return getChatMsg;
}]);

chattestServices.factory('getNewChatMsg', ['getChatMsg', function(getChatMsg) {
    return new GetNewest(getChatMsg);
}]);