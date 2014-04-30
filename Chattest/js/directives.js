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

chattestApp.directive('prefOption', [ function() {
    function link(scope) {
        var collection = scope.prefModel.collection;
        scope.col_array = window[collection];
        scope.counter = 0;

        scope.changePref = function(direction) {
            var step;

            if (direction === "left") {
                if (scope.counter === 0) {
                    scope.counter = scope.col_array.length;
                }
                step = -1;
            }
            else if(direction ==="right") {
                if (scope.counter === scope.col_array.length - 1) {
                    scope.counter = -1;
                }
                step = 1;
            }
            scope.counter += step;
            if (collection === "all_styles") {
                changeColorScheme(all_styles[scope.counter].style);
            } else if (collection === "all_sounds") {
                window.cur_sound = scope.counter;
            }
        };
    }
    window.link = link;
    return {
        link: link,
        restrict: 'E',
        scope: {
            prefModel: '='
        },
        templateUrl: 'templates/pref-option.html'
    };
}]);