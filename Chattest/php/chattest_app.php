<?php
    session_start();

    include "LoginOps.php";

    if(!LoginOps::isLoggedIn()) {
        header("Location: ../index.php");
        die();
    }
?>

<html ng-app="chattestApp">
    <head>
        <meta charset="UTF-8">
        <title>Chattest</title>
        <link rel="stylesheet" type="text/css" href="../css/chattest.css" media="screen" />
        <script type="text/javascript" src="../angular.min.js"></script>
        <script type="text/javascript" src="../js/libraries/moment.min.js"></script>
        <script type="text/javascript" src="../utils.js"></script>
        <script type="text/javascript" src="../main.js"></script>
        <script type="text/javascript" src="../services.js"></script>
        <script type="text/javascript" src="../controllers.js"></script>
    </head>
    <body ng-controller="appBody">
        <div id="message-box">
            <div id="message-area">
                <p ng-repeat="message in messages">
                    <span class="user-message-name">{{message.name}}:</span>
                    <span class="user-message-msg">{{message.msg}}</span>
                    <span class="user-message-dt">{{message.dt.dt_ago}}</span>
                </p>
            </div>
            <div id="input-toolbar">
                <input id="send-msg" type="text" ng-keypress="sendMsg($event);">
                <button id="send-msg-button" ng-click="sendMsg($event,'click');">Send</button>
            </div>
        </div>
        <button id="logout-button" ng-click="logout()">Log out</button>
    </body>
</html>