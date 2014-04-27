<?php
    session_start();

    include "php/LoginOps.php";

    if(!LoginOps::isLoggedIn()) {
        header("Location: index.php");
        die();
    }
?>

<html ng-app="chattestApp">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0
            maximum-scale=1.0, user-scalable=no" />
        <meta charset="UTF-8">
        <title>Chattest - Main Chat Room | Where Random Strangers become Friends</title>
        <meta name="description" content="Chat with random English-speaking people
              from around the world! Chattest is an online chatroom open 24/7 to
              anyone feeling bored or lonely.">
        <meta name="keywords" content="chatroom, randomchat, chat room, random chat, lonely, bored, strangers, chat">
        <link rel="stylesheet" type="text/css" href="css/ui-darkness/jquery-ui-1.10.4.custom.css" media="screen" />
        <link rel="stylesheet" type="text/css" href="css/chattest.css" media="screen" />
        <!-- Color schemes -->
        <link rel="stylesheet" type="text/css" href="css/color_schemes/tangerine_marmalade.css" 
              title="Tangerine Marmalade" media="screen" />
        <link rel="alternate stylesheet" type="text/css" href="css/color_schemes/peppermint_tea.css"
              title="Peppermint Tea" media="screen" />
        <link rel="alternate stylesheet" type="text/css" href="css/color_schemes/blueberry_pie.css"
              title="Blueberry Pie" media="screen" />
        <link rel="alternate stylesheet" type="text/css" href="css/color_schemes/mango_sorbet.css"
              title="Mango Sorbet" media="screen" />

        <script type="text/javascript" src="js/libraries/jquery-1.10.2.js"></script>
        <script type="text/javascript" src="js/libraries/jquery-ui-1.10.4.custom.min.js"></script>
        <script type="text/javascript" src="js/libraries/moment.min.js"></script>
        <script type="text/javascript" src="js/angular.min.js"></script>
        <script type="text/javascript" src="js/libraries/sanitize.js"></script>
        <script type="text/javascript" src="js/utils.js"></script>
        <script type="text/javascript" src="js/main.js"></script>
        <script type="text/javascript" src="js/services.js"></script>
        <script type="text/javascript" src="js/controllers.js"></script>
        <script type="text/javascript" src="js/directives.js"></script>
    </head>
    <body ng-controller="appBody">
        <div id="message-area">
            <chat-msg-area></chat-msg-area>
        </div>
        <div id="user-list">
            <div id="user-list-names">
                <span class="user-list-name" ng-repeat="username in online">
                    {{username}}{{$last ? '' : ', '}}
                </span>
            </div>
        </div>
        <div id="side-panel">
            <div id="show-users" ng-click="showUserList();"></div>
            <div id="facebook-link">
                <a href="JavaScript:showPopup('https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fchattest.ca')">
                    <img id="facebook-logo" alt="Share chattest.ca on Facebook"
                        src="css/logos-and-badges_f-logo_online/png/FB-f-Logo__blue_50.png">
                </a>
            </div>
        </div>
        <div id="google-ads">
        <style>
            .adsense-responsive { width: 320px; height: 50px; }
            @media(min-width: 500px) { .adsense-responsive { width: 468px; height: 60px; } }
            @media(min-width: 800px) { .adsense-responsive { width: 728px; height: 90px; } }
        </style>
        <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
        <!-- adsense_responsive -->
        <ins class="adsbygoogle adsense-responsive"
             style="display:inline-block"
             data-ad-client="ca-pub-7983402069683866"
             data-ad-slot="6087077430"></ins>
        <script>
            (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
        </div>

        <div id="control-panel-input-area">
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
                        <div id="color-options-mango" class="control-panel-options
                             control-panel-sub-option">
                            <span class="control-panel-options-text">Mango</span>
                        </div>
                        <div id="color-options-blueberry" class="control-panel-options
                             control-panel-sub-option">
                            <span class="control-panel-options-text">Blueberry</span>
                        </div>
                        <div id="color-options-peppermint" class="control-panel-options
                             control-panel-sub-option">
                            <span class="control-panel-options-text">Peppermint</span>
                        </div>
                        <div id="color-options-tangerine" class="control-panel-options
                             control-panel-sub-option">
                            <span class="control-panel-options-text">Tangerine</span>
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
                            <span class="control-panel-options-text" ng-click="logout();">
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
                    <input id="send-msg" type="text" maxlength="500"
                           ng-keypress="sendMsg($event);">
                </div>
            </div>
        </div>
    </body>
</html>