chattestApp.service('sendChatMsg', function($http){
    var url = "send_msg.php";
    var msg_str = send_msg.value;
    var name = set_name.value;
    
    url += "?name=" + name + "&msg=" + msg_str;
    
    $http.get(url).success(function(data) {
            $scope.messages = data;
    });
    
    msg_str.value = "";
});