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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charset="UTF-8">
        <title>Chattest - A Chat Room for Lonely Hearts | Sign up</title>
        <link rel="stylesheet" type="text/css" href="../css/chattest_user_ops.css" media="screen" />
    </head>
    <body>
        <h1 id="header-main">
            Chattest
        </h1>
        <h3>
            Create your free account!
        </h3>
        <div id="signup-footer">
            Registration
        </div>

<?php
    include "credentials.php";

    $check_sbm = isset($_POST['submit']);

    //If the user has just submitted the form, check if form data is valid
    if ($check_sbm) {
        $usr = $_POST['username'];
        $pw1 = $_POST['pass'];
        $pw2 = $_POST['pass2'];

        $check_usr = !!$usr;
        $check_pw1 = !!$pw1;
        $check_pw2 = !!$pw2;
        $check_unl = (strlen($usr) > 5 && strlen($usr) < 15 ? true : false);
        $check_p1l = (strlen($pw1) > 7 && strlen($pw1) < 33 ? true : false);

        $check_forms = false; //Initializing other check variables
        $check_unq = false;
        
        if($check_pw1 && $check_pw2) {
            $check_p12 = $pw1 == $pw2;
        }
        //First check if something obvious is wrong with the submitted form data
        if($check_usr && $check_pw1 && $check_pw2 && $check_p12 && $check_unl && $check_p1l) {
            //Then perform more costly checks (i.e. username uniqueness in db)
            $check_forms = true;
            
            $db = new PDO('mysql:host=localhost;dbname=chattest_users;charset=utf8',
                $credentials["login"]["id"], $credentials["login"]["pass"]);
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            
            try {
                $stmt = $db->prepare("SELECT * FROM all_users WHERE name = ?");
            }
            catch(PDOException $ex) {
                echo "There was a problem accessing the user database: " . $ex->getMessage();
            }

            $stmt->execute(array($usr));
            $check_unq = ($stmt->rowCount() == 0 ? true : false);
        }
    }
    //Check whether the form was submitted, or if the form or database checks failed
    //If one of the checks fail, re-render the input forms...
    if (!$check_sbm || !$check_forms || !$check_unq) {
?>
        <form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">
            <input type="text" placeholder="Username (6-14 chars)"
                   name="username" maxlength="14"
                   value="<?php echo isset($usr) ? $usr : "" ?>">
            <input type="password" placeholder="Password (8-32 chars)"
                   name="pass" maxlength="32">
            <input type="password" placeholder="Repeat Password"
                   name="pass2" maxlength="32">
            <br>
            <input id="signup-button" class="user-ops-button"
                type="submit" name="submit" value="">
        </form>
        <div id="error-container">
<?php
    //... and give more specific information about problem with submitted form data
    if(!$check_sbm) {
        echo '<span id="initial-message">Choose a username and password!<span>' .
            LoginOps::highlightInput(0);
    } elseif (!$check_usr) {
        echo 'Please select a username.' . LoginOps::highlightInput(0);
    } elseif (!$check_pw1) {
        echo 'Please select a password.' . LoginOps::highlightInput(1);
    } elseif (!$check_pw2) {
        echo 'You must confirm your password.' . LoginOps::highlightInput(1);
    } elseif (!$check_unl) {
        echo 'Your username should be <strong>6-14 characters</strong> long.' .
            LoginOps::highlightInput(0);
    } elseif (!$check_p1l) {
        echo 'Your password should be <strong>8-32 characters</strong> long.' .
            LoginOps::highlightInput(1);
    } elseif (!$check_p12) {
        echo 'Your passwords did not match.' . LoginOps::highlightInput(1);
    } elseif (!$check_unq) {
        echo 'Sorry, the username <strong>' . $usr .
            '</strong> is already in use.' . LoginOps::highlightInput(0);
    }
?>
        </div>
        <h5 id="sign-in-message">
            Already registered? <a href="../index.php">Sign in</a> now.
        </h5>
    </body>
</html>

<?php
        }
    //Otherwise, if the form data is valid and the username is unique
    //then add the new user's information into the database
    else {
        $pw1 = password_hash($pw1, PASSWORD_BCRYPT);

        try {
            $stmt = $db->prepare("INSERT INTO all_users (name, pass) " .
                "VALUES (:name, :pass)");
            $stmt->execute(array(':name' => $usr, ':pass' => $pw1));
        }
        catch(PDOException $ex) {
            echo "There was a problem adding to the user database: " . $ex->getMessage();
        }

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