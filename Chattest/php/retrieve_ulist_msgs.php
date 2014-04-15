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

    $last_date = file_get_contents('php://input');
    
    try {
        $db->beginTransaction();

        $stmt = $db->prepare("SELECT * FROM messages WHERE dt > ? " .
        " ORDER BY id DESC LIMIT 30");
        $stmt->execute(array($last_date));
        $JSON_data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $stmt = $db->prepare("DELETE IGNORE FROM online WHERE name = ?");
        $stmt->execute(array($_SESSION['userid']));

        $stmt = $db->prepare("INSERT IGNORE INTO online (name, dt) VALUES (?, now())");
        $stmt->execute(array($_SESSION['userid']));

        //If client has not POSTed their username and a timestamp to the server
        //for 12 seconds, it is assumed the user has closed the browser window
        $stmt = $db->prepare("SELECT name FROM online WHERE dt BETWEEN " .
            "DATE_SUB(NOW(), INTERVAL 12 SECOND) AND NOW()");
        $stmt->execute();
        $user_roster = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $db->commit();
    }
    catch(PDOException $ex) {
        $db->rollBack();
        echo "There was a problem accessing the message database: " .
            $ex->getMessage();
    }
    
    $msg_json = '{"all":';
    $msg_json .= json_encode($JSON_data);
    $msg_json .= ',"online":';
    $msg_json .= json_encode($user_roster);
    $msg_json = rtrim($msg_json,",");
    $msg_json .= '}';
    echo $msg_json;