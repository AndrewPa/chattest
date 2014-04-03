<?php
    session_start();
    ob_start();

    include "php/LoginOps.php";

    if(LoginOps::isLoggedIn()) {
        header("Location: php/chattest_app.php");
        die();
    }
    else {
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Chattest Login</title>
        <link rel="stylesheet" type="text/css" href="css/chattest_user_ops.css" media="screen" />
    </head>
    <body>
        <div>
            <h2>Welcome to Chattest!</h2>
            <h4>
                Enter your chat name and password!
            </h4>
        </div>
        <form class="in-block" action="<?php echo $_SERVER['PHP_SELF']?>" method="post">
            <input type="text" placeholder="Username" name="username" maxlength="40">
            <input type="password" placeholder="Password" name="pass" maxlength="50"> 
            <br><input id="login-button" class="user-ops-button" type="submit" name="submit" value="">
        </form>
        <h5>Don't have an account? Go ahead and <a href="php/signup.php">sign up</a>!</h5>
    </body>
</head>

<?php 
    }

    include "php/credentials.php";

    mysql_connect("localhost", $credentials["login"]["id"],
            $credentials["login"]["pass"]) or die(mysql_error());
    mysql_select_db("chattest_users") or die(mysql_error());

    if (isset($_POST['submit'])) {
        if(!$_POST['username']) {
            die('Please enter your username.');
        }
        if(!$_POST['pass']) {
            die('Please enter your password.');
        }

        $check = mysql_query("SELECT * FROM all_users WHERE " . 
            "name = '".$_POST['username']."'") or die(mysql_error());
        $check2 = mysql_num_rows($check);

        if ($check2 == 0) {
            die('Sorry, user <strong>' . $_POST['username'] .
                '</strong> does not exist.');
        }

        while($info = mysql_fetch_array($check)) {
            $_POST['pass'] = stripslashes($_POST['pass']);
            $info['pass'] = stripslashes($info['pass']);
            $_POST['pass'] = md5($_POST['pass']);

            if ($_POST['pass'] != $info['pass']) {
                die('Incorrect password for user <strong>' .
                    $_POST['username'] . '</strong>.');
            }
            else {
                LoginOps::validateUser($_POST['username']);
                header("Location: php/chattest_app.php");
                die();
            }
        }
    }
?>