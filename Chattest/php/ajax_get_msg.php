<?php
    include "credentials.php";

    $db = new PDO('mysql:host=localhost;dbname=chattest_messages;charset=utf8',
    $credentials["r_user"]["id"], $credentials["r_user"]["pass"]);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

    $last_date = $_GET["ld"];
    
    try {
        $stmt = $db->prepare("SELECT * FROM messages WHERE dt > ? " .
        " ORDER BY id DESC LIMIT 50");
        $stmt->execute(array($last_date));
    }
    catch(PDOException $ex) {
        echo "There was a problem accessing the message database: " . $ex->getMessage();
    }
    
    $msg_json = '{"all":';
    $msg_json .= json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    $msg_json = rtrim($msg_json,",");
    $msg_json .= '}';
    echo $msg_json;