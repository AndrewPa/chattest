<?php
    session_start();
ini_set('display_startup_errors',1);
ini_set('display_errors',1);
error_reporting(-1);
    include "credentials.php";

    $db = new PDO('mysql:host=localhost;dbname=chattest_messages;charset=utf8',
        $credentials["r_user"]["id"], $credentials["r_user"]["pass"]);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

    $usr = $_SESSION['userid'];
    $msg = file_get_contents('php://input');
    $dt = date("Y-m-d H:i:s");

    try {
        $stmt = $db->prepare("INSERT INTO messages(name, msg, dt)"
                . "VALUES(:name, :msg, :dt)");
        $stmt->execute(array(':name'=>$usr, ':msg' => $msg, ':dt' => $dt));
    }
    catch(PDOException $ex) {
        echo "There was a problem adding to the message database: " . $ex->getMessage();
    }