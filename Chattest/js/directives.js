var chattestDirectives = angular.module('chattestDirectives', []);

chattestApp.directive('chatMsgArea', [ function() {
    var template = '';
    for(var i=0;i<30;i++) {
        template += '' + 
            '<p>' +
                '<span class="user-message-name">{{messages[' + i + '].name}}:</span>' +
                '<span class="user-message-msg" ng-bind-html="messages[' + i + '].msg"></span>' +
                '<span class="user-message-dt">{{messages[' + i + '].dt.dt_ago}}</span>' +
            '</p>';
    }
    return {
        restrict: 'E',
        template: template
    };
}]);