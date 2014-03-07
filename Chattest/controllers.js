chattestApp.controller('FetchCtrl', function ($scope, $http, $interval) {
    $interval(function() {
        $http.get('ajax_get_msg.php').success(function(data) {
            $scope.messages = data;
        });
    }, 5000);
});

chattestApp.controller('SendCtrl', function ($scope, $http) {
    $scope.sendMsg = function(e) {
        if (e.which === 13) {
            var url = "php_utils/send_msg.php";
            var msg_str = send_msg.value;
            var name = set_name.value;

            url += "?name=" + name + "&msg=" + encodeURIComponent(msg_str);

            $http.get(url).success(function(data) {
                 $scope.messages = data;
            });
            send_msg.value = "";
        };
    };
});