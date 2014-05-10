<?php
    session_start();
    
    if(!isset($_SESSION['userid']) || !$_SESSION['userid']) {
        header("Location: ../index.php");
        die();
    }

    include "credentials.php";

    $db = new PDO('mysql:host=localhost;dbname=chattest_messages;charset=utf8',
    $credentials["r_user"]["id"], $credentials["r_user"]["pass"]);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

    try {
        $stmt = $db->prepare("SELECT name FROM online " .
        "ORDER BY name");
        $stmt->execute();
        $JSON_data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    catch(PDOException $ex) {
        $db->rollBack();
        echo "There was a problem accessing the message database: " .
            $ex->getMessage();
    }

    $msg_json = '{"all":';
    $msg_json .= json_encode($JSON_data);
    $msg_json = rtrim($msg_json,",");
    $msg_json .= '}';
    echo $msg_json;