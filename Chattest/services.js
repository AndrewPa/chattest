var chattestServices = angular.module('chattestServices');

chattestApp.service('getChatMsg', function($http){
    $http.get('ajax_get_msg.php').success(function(data) {
        return data;
    });
});