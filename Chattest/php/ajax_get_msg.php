<?php
    include "credentials.php";

    mysql_connect("localhost", $credentials["r_user"]["id"],
        $credentials["r_user"]["pass"]) or die(mysql_error());
    mysql_select_db("chattest_messages") or die(mysql_error());

    $last_date = "'" . $_GET["ld"] . "'";

    $q_string = "SELECT * FROM messages WHERE dt > " . $last_date .
        " ORDER BY id DESC LIMIT 50";

    $result = mysql_query($q_string) or die(mysql_error());

    $msg_json = '{"all":[';
    while ($line = mysql_fetch_array($result,MYSQL_ASSOC)) {
        $msg_json .= json_encode($line) . ",";
    }
    $msg_json = rtrim($msg_json,",");
    $msg_json .= ']}';
    echo $msg_json;
?>