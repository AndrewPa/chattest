<?php
    
    mysql_connect("localhost", "chattest_logins") or die(mysql_error());
    mysql_select_db("chattest_users") or die(mysql_error());

    if(isset($_COOKIE['ID_my_site'])) {
        $username = $_COOKIE['ID_my_site']; 
        $pass = $_COOKIE['Key_my_site'];
        $check = mysql_query("SELECT * FROM all_users WHERE " .
                "name = '$username'")or die(mysql_error());

        while($info = mysql_fetch_array( $check )) {
            if ($pass != $info['pass']) {
                header("Location: ../index.php");
                die();
            }
        }
    }
    else {
        header("Location: ../index.php");
        die();
    }
?>

<html ng-app="chattestApp">
    <head>
        <meta charset="UTF-8">
        <title>Chattest</title>
        <script type="text/javascript" src="../angular.min.js"></script>
        <script type="text/javascript" src="../utils.js"></script>
        <script type="text/javascript" src="../main.js"></script>
        <script type="text/javascript" src="../services.js"></script>
        <script type="text/javascript" src="../controllers.js"></script>
    </head>
    <body ng-controller="appBody">
        <div id="message-box">
            <ul>
                <li ng-repeat="message in messages">
                    <p>
                        {{message.username}}:
                        {{message.message}}
                        {{message.msg_date}}
                    </p>
                </li>
            </ul>  
            <input id="send-msg" type="text" ng-keypress="sendMsg($event);">
            <button id="send-msg-button" ng-click="sendMsg($event,'click');">Send</button>
        </div>
        <button id="logout-button" ng-click="logout()">Log out</button>
    </body>
</html>