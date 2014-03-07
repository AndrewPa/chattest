<?php
    $past = time() - 100;

    setcookie(ID_my_site, gone, $past, '/'); 

    setcookie(Key_my_site, gone, $past, '/'); 

    header("Location: ../index.php");

    die();
?>