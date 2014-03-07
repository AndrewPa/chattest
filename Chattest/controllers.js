var chattestApp = angular.module('chattestApp', ['chattestServices']);

chattestApp.controller('FetchCtrl', function ($scope, $http, $interval, getChatMsg) {
    $interval(getChatMsg, 4000);
});

chattestApp.controller('SendCtrl', function ($scope, $http) {
    $scope.sendMsg = function(e,c) {
        if (e.which === 13 || c === "click") {
            var url = "send_msg.php";
            var msg_str = send_msg.value;

            url += "?msg=" + encodeURIComponent(msg_str);

            $http.get(url).success(function(data) {
                 $scope.messages = data;
            });
            send_msg.value = "";
        };
    };
});

chattestApp.controller('Logout', function ($scope) {
    $scope.logout = function() {
        
    };
});