<?php
    $username = "chattest_admin";
    $password = "";
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

    $q_string = "SELECT * from messages order by id desc limit 200";

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