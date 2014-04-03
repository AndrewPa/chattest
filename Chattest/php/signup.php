<?php
    session_start();

    include "LoginOps.php";

    if(LoginOps::isLoggedIn()) {
        header("Location: chattest_app.php");
        die();
    }
    
    //if(isset($_COOKIE['ID_my_site'])) {
    //    echo 'You are already logged in. Please <a href="logout.php">log out</a> ' .
    //    'to create a new account or <a href="chattest_app.php">go to the chat room</a>.';
    //    die();
    //}
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Chattest Signup</title>
        <link rel="stylesheet" type="text/css" href="../css/chattest_user_ops.css" media="screen" />
    </head>
    <body>
        <h2>Chattest Account Creation</h2>

<?php
    include "credentials.php";

    $check_sbm = isset($_POST['submit']);

    //If the user has just submitted the form, check if form data is valid
    if ($check_sbm) {
        $check_usr = !!$_POST['username'];
        $check_pw1 = !!$_POST['pass'];
        $check_pw2 = !!$_POST['pass2'];
        if($check_pw1 && $check_pw2) {
            $check_p12 = $_POST['pass'] == $_POST['pass2'];
        }
        //First check if something obvious is wrong with the submitted form data
        if($check_usr && $check_pw1 && $check_pw2 && $check_p12) {
            //Then perform more costly checks (i.e. username uniqueness in db)
            $check_forms = true;

            mysql_connect("localhost", $credentials["login"]["id"],
                    $credentials["login"]["pass"]) or die(mysql_error());
            mysql_select_db("chattest_users") or die(mysql_error());

            if (!get_magic_quotes_gpc()) {
                $_POST['username'] = addslashes($_POST['username']);
            }

            $usercheck = $_POST['username'];
            $user_query = mysql_query("SELECT name FROM all_users WHERE name = '$usercheck'") 
                or die(mysql_error());
            $check_unq = (mysql_num_rows($user_query) == 0 ? true : false);
        }
    }
    //Check whether the form was submitted, or if the form or database checks failed
    //If one of the checks fail, re-render the input forms...
    if (!$check_sbm | !$check_forms | !$check_unq) {
?>

        <h4>Choose your name and password:</h4>
        <form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">
            <input type="text" placeholder="Username" name="username" maxlength="60">
            <input type="password" placeholder="Password" name="pass" maxlength="10"></td>
            <input type="password" placeholder="Confirm Password" name="pass2" maxlength="10">
            <br><input id="signup-button" class="user-ops-button" type="submit" name="submit" value="">
        </form>

<?php
    //... and give more specific information about problem with submitted form data
    if(!$check_sbm) {
        echo '<h5>Already registered? <a href="../index.php">Sign in</a> now.</h5>';
    } elseif (!$check_usr) {
        echo '<p>Please select a username.</p>';
    } elseif (!$check_pw1) {
        echo '<p>Please select a password.</p>';
    } elseif (!$check_pw2) {
        echo '<p>Please confirm your password.</p>';
    } elseif (!$check_p12) {
        echo '<p>Your passwords did not match.</p>';
    } elseif (!$check_unq) {
        echo '<p>Sorry, the username <strong>' . $_POST['username'] .
            '</strong> is already in use.</p>';
    }
?>

    </body>
</html>

<?php
        }
    //Otherwise, if the form data is valid and the username is unique
    //then add the new user's information into the database
    else {
        $_POST['pass'] = md5($_POST['pass']);
            if (!get_magic_quotes_gpc()) {
                $_POST['pass'] = addslashes($_POST['pass']);
                $_POST['username'] = addslashes($_POST['username']);
            }

        $insert = "INSERT INTO all_users (name, pass)
            VALUES ('".$_POST['username']."', '".$_POST['pass']."')";
        mysql_query($insert) or die(mysql_error());
        
    //Then finally render a message alerting user that the account was
    //registered, i.e., without the input forms being re-rendered; this
    //is to reduce the risk of a user accidentally attempting to re-register
    
?>

            <p>
                Your username and password have been registered! You can now
                    <a href="../index.php">log in.</a>
            </p>
        </div>
    </body>
</html>

<?php
    }
?>