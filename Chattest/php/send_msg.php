<?php
    ini_set('display_errors','On');
    error_reporting(E_ALL);

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

    $msg_content = $_GET["msg"];
    $date_time = date("Y-m-d H:i:s");

    $q_string = "INSERT INTO messages(username,msg_date,message) " .
        "values(" . 
        '"' . $username . '"' . "," . 
        '"' . $date_time . '"' . "," .
        '"' . mysql_real_escape_string($msg_content) . '"' . ");";

        echo $q_string;

    $result = mysql_query($q_string);

    if(!$result) {
        die('There was a problem querying the MySQL database. ' . 
            'Error given: ' . mysql_error());
    }
?>