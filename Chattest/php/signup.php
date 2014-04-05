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
        $usr = $_POST['username'];
        $pw1 = $_POST['pass'];
        $pw2 = $_POST['pass2'];

        $check_usr = !!$usr;
        $check_pw1 = !!$pw1;
        $check_pw2 = !!$pw2;
        $check_unl = (strlen($usr) > 5 && strlen($usr) < 15 ? true : false);
        $check_p1l = (strlen($pw1) > 7 && strlen($pw1) < 17 ? true : false);

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

        <h4>Choose your name and password:</h4>
        <form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">
            <input type="text" placeholder="Username" name="username" maxlength="30">
            <input type="password" placeholder="Password" name="pass" maxlength="30"></td>
            <input type="password" placeholder="Confirm Password" name="pass2" maxlength="30">
            <br><input id="signup-button" class="user-ops-button" type="submit" name="submit" value="">
        </form>
        <h5>Already registered? <a href="../index.php">Sign in</a> now.</h5>
<?php
    //... and give more specific information about problem with submitted form data
    if(!$check_sbm) {
        //Render nothing additional, proceed to next check
    } elseif (!$check_usr) {
        echo '<p>Please select a username.</p>';
    } elseif (!$check_pw1) {
        echo '<p>Please select a password.</p>';
    } elseif (!$check_pw2) {
        echo '<p>Please confirm your password.</p>';
    } elseif (!$check_unl) {
        echo '<p>Your username should be <strong>6-14 characters</strong> long.</p>';
    } elseif (!$check_p1l) {
        echo '<p>Your password should be <strong>8-16 characters</strong> long.</p>';
    } elseif (!$check_p12) {
        echo '<p>Your passwords did not match.</p>';
    } elseif (!$check_unq) {
        echo '<p>Sorry, the username <strong>' . $usr .
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