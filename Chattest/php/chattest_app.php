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
        <link rel="stylesheet" type="text/css" href="../css/ui-darkness/jquery-ui-1.10.4.custom.css" media="screen" />
        <link rel="stylesheet" type="text/css" href="../css/chattest.css" media="screen" />
        <script type="text/javascript" src="../js/libraries/jquery-1.10.2.js"></script>
        <script type="text/javascript" src="../js/libraries/jquery-ui-1.10.4.custom.min.js"></script>
        <script type="text/javascript" src="../js/libraries/moment.min.js"></script>
        <script type="text/javascript" src="../js/angular.min.js"></script>
        <script type="text/javascript" src="../js/utils.js"></script>
        <script type="text/javascript" src="../js/main.js"></script>
        <script type="text/javascript" src="../js/services.js"></script>
        <script type="text/javascript" src="../js/controllers.js"></script>
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
        </div>
        <div id="control-panel-area">
            <div id="control-panel-tab">
                 ^
            </div>
            <div id="control-panel">
                <!-- Main Menu -->
                <div id="color-options" class="control-panel-options control-panel-option">
                    <span id="color-options-text" class="control-panel-options-text">
                        Color
                    </span>
                </div>
                <div id="layout-options" class="control-panel-options control-panel-option">
                    <span id="layout-options-text" class="control-panel-options-text">
                        Layout
                    </span>
                </div>
                <div id="system-options" class="control-panel-options control-panel-option">
                    <span id="system-options-text" class="control-panel-options-text">
                        System
                    </span>
                </div>
                
                <!-- Sub-Menus -->
                <div id="color-options-buttons" class="control-panel-sub-options">
                    <div id="color-options-skyblue" class="control-panel-options
                         control-panel-sub-option">
                        <span class="control-panel-options-text">SkyBlue</span>
                    </div>
                    <div id="color-options-mint" class="control-panel-options
                         control-panel-sub-option">
                        <span class="control-panel-options-text">Mint</span>
                    </div>
                    <div id="color-options-pbc" class="control-panel-options
                         control-panel-sub-option">
                        <span class="control-panel-options-text">P.B.C.</span>
                    </div>
                </div>
                <div id="layout-options-buttons" class="control-panel-sub-options">
                    <div id="layout-options-speechbubbles" class="control-panel-options
                         control-panel-sub-option">
                        <span class="control-panel-options-text">Coming Soon!</span>
                    </div>
                </div>
                <div id="system-options-buttons" class="control-panel-sub-options">
                    <div id="system-options-logout" class="control-panel-options
                         control-panel-sub-option">
                        <span class="control-panel-options-text" ng-click="logout()">
                            Logout
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div id="input-toolbar">
            <div id="send-msg-button" class="user-icons" 
                ng-app="" ng-click="sendMsg($event,'click');">
            </div>
            <div id="send-msg-container">
                <input id="send-msg" type="text" ng-keypress="sendMsg($event);">
            </div>
        </div>
    </body>
</html>