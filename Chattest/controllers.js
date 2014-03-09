var chattestControllers = angular.module('chattestControllers', []);

chattestApp.controller('getSendCtrl', ['$scope', '$interval', 'getChatMsg',
    'sendChatMsg', function ($scope, $interval, getChatMsg, sendChatMsg) {
        $scope.messages = [];
        $interval(function() {
            getChatMsg.async().then(function(d) {
                var any_new = addNewMsg(d); //Mesages added as side effect if any are new
                if (any_new) {
                    $scope.messages = temp_chatCache.total;
                }
            });
        }, 4000);
        $scope.sendMsg = function(e,c) {
            if (e.which === 13 || c === "click") {
                sendChatMsg.sendMsg();
            };
        };
        $scope.logout = function() {
        
        };
}]);