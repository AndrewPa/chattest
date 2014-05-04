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
    function link(scope) {
        scope.$watch('messages', function() {
            scrollToBottom();
        });
    }
    return {
        link: link,
        restrict: 'E',
        template: template
    };
}]);

chattestApp.directive('prefOption', [ function() {
    function link(scope) {
        var collection = scope.prefModel.collection;
        scope.counter = 0;

        if (collection === "all_styles") {
            scope.counter = init_col;
        }
        else if (collection === "all_sounds") {
            scope.counter = cur_sound;
        }

        scope.col_array = window[collection];

        scope.changePref = function(direction) {
            var step;

            if (direction === "left") {
                if (scope.counter === 0) {
                    step = scope.col_array.length - 1;
                }
                else {
                    step = -1;
                }
            }
            else if(direction ==="right") {
                if (scope.counter === scope.col_array.length - 1) {
                    step = -1 * (scope.col_array.length - 1);
                }
                else {
                    step = 1;
                }
            }
            scope.counter += step;
            if (collection === "all_styles") {
                changeColorScheme(scope.counter);
                document.cookie = 'col=' + scope.counter + '; expires=' +
                    cookie_exp + '; path=/';
            }
            else if (collection === "all_sounds") {
                window.cur_sound = scope.counter;
                document.cookie = 'snd=' + scope.counter + '; expires=' +
                    cookie_exp + '; path=/';
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