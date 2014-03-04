<html ng-app="chattestApp">
    <head>
        <meta charset="UTF-8">
        <title>Chattest</title>
        <script type="text/javascript" src="angular.min.js"></script>
        <script type="text/javascript" src="main.js"></script>
        <script type="text/javascript" src="services.js"></script>
        <script type="text/javascript" src="controllers.js"></script>
    </head>
    <body>
        <div ng-controller="FetchCtrl">
            <ul>
                <li ng-repeat="message in messages.all">
                    <p>
                        {{message.username}}:
                        {{message.message}}
                        {{message.msg_date}}
                    </p>
                </li>
            </ul>
        </div>
        <div ng-controller="SendCtrl">
            <input id="set-name" type="text" ng-keypress="">
            <input id="send-msg" type="text" ng-keypress="sendMsg($event);">
        </div>
    </body>
</html>