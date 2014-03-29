<?php
    include "credentials.php";

    mysql_connect("localhost", $credentials["r_user"]["id"],
        $credentials["r_user"]["pass"]) or die(mysql_error());
    mysql_select_db("chattest_messages") or die(mysql_error());

    $username = $_COOKIE['ID_my_site'];
    $msg_content = $_GET["msg"];
    $date_time = date("Y-m-d H:i:s");

    $q_string = "INSERT INTO messages(name, msg, dt) " .
        "values(" . 
        '"' . $username . '"' . "," . 
        '"' . mysql_real_escape_string($msg_content) . '"' . "," .
        '"' . $date_time . '"' . ");";

        echo $q_string;

    mysql_query($q_string) or die(mysql_error());
?>