<?php
    $username = $_COOKIE['ID_my_site'];
    $password = $_COOKIE['Key_my_site'];
    $server = "localhost";
    $database = "chattest";

    $mysqlconnection = mysql_connect($server, $username, $password);
    if (!$mysqlconnection) {
        die('There was a problem connecting to the MySQL server. ' . 
            'Error given: ' . mysql_error());
    }

    $databaseconnection = mysql_select_db($database, $mysqlconnection);
    if (!$databaseconnection) {
        die('There was a problem selecting the MySQL database. ' . 
                'Error given: ' . mysql_error());
    }

    $last_date = "'" . $_GET["ld"] . "'";

    $q_string = "SELECT * FROM messages WHERE msg_date > " . $last_date .
        " ORDER BY id DESC LIMIT 50";

    $result = mysql_query($q_string) or die(
        'There was a problem querying the MySQL database. ' . 
        'Error given: ' . mysql_error());

    $msg_json = '{"all":[';
    while ($line = mysql_fetch_array($result,MYSQL_ASSOC)) {
        $msg_json .= json_encode($line) . ",";
    }
    $msg_json = rtrim($msg_json,",");
    $msg_json .= ']}';
    echo $msg_json;
?>