<?php
    session_start();
    ob_start();

    include "php/LoginOps.php";

    if(LoginOps::isLoggedIn()) {
        header("Location: main-chat-room.php");
        die();
    }
    else {
        if (isset($_POST['submit'])) {
            $check_sbm = true;
            $usr = $_POST['username'];
        }
        else {
            $check_sbm = false;
        }
        $check_sbm_s = isset($_POST['submit_s']);

        if ((!$check_sbm && !$check_sbm_s) || $check_sbm) {
            $start_page = "login";
        }
        else if ($check_sbm_s) {
            $start_page = "signup";
        }
?>

<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charset="UTF-8">
        <title>Chattest - A Free Online Random Chat Room for Lonely Strangers!</title>
        <meta name="description" content="Chattest is a new free online chatroom
              and chat room community for random strangers who are bored,
              lonely, or who just want to have a chat with new people.">
        <meta name="keywords" content="chat, chat room, lonely, strangers, random, free online chat room">
        <link rel="stylesheet" type="text/css" href="css/chattest_user_ops.css" media="screen" />
        <script type="text/javascript" src="js/libraries/jquery-1.10.2.js"></script>
        <script type="text/javascript" src="js/user_ops_main.js"></script>
    </head>
    <body>
        <script>
            var start_page = "<?php echo $start_page ?>";
        </script>
        <h1 class="header-main">Chattest</h1>
        <div id="main-container" class="section-container">
            <h2 id="header-sub">
                An Awesome Free Online Chat Room
            </h2>
            <div class="error-container">

<?php 
    }

    if($check_sbm) {
        include "php/credentials.php";

        $pwd = $_POST['pass'];

        $check_usr = !!$usr;
        $check_pwd = !!$pwd;

        $check_urf = false; //Initializing other check variables
        $check_cpd = false;

        if($check_usr && $check_pwd) {
            $db = new PDO('mysql:host=localhost;dbname=chattest_users;charset=utf8',
                $credentials["login"]["id"], $credentials["login"]["pass"]);
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

            try {
                $stmt = $db->prepare("SELECT * FROM all_users WHERE name = ?");
                $stmt->execute(array($usr));
            }
            catch(PDOException $ex) {
                echo "There was a problem accessing the user database: " .
                    $ex->getMessage();
            }
            $check_urf = ($stmt->rowCount() > 0 ? true : false);
        }

        if ($check_urf) {
            while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                if (password_verify($pwd, $row['pass'])) {
                    LoginOps::validateUser($_POST['username']);
                    header("Location: main-chat-room.php");
                    die();
                }
                else {
                    $check_cpd = false;
                }
            }
        }
        if (!$check_usr) {
            echo 'Please enter your username.' . LoginOps::highlightInput(0);
        } elseif (!$check_pwd) {
            echo 'Please enter your password.' . LoginOps::highlightInput(1);
        } elseif (!$check_urf) {
            echo 'Sorry, user <strong>' . $usr .
                '</strong> does not exist.' . LoginOps::highlightInput(0);
        } elseif (!$check_cpd) {
            echo 'Incorrect password for user <strong>' . $usr . '</strong>.' .
                LoginOps::highlightInput(1);
        }
    }
    else {
        echo '<div class="initial-message">Enter your username and password!' .
            '</div>' . LoginOps::highlightInput(0);
    }
?>

            </div>
            <form class="in-block" action="<?php echo $_SERVER['PHP_SELF']?>" method="post">
                <input type="text" placeholder="Username" name="username"
                       maxlength="14" value="<?php echo isset($usr_ph) ? $usr_ph : "" ?>">
                <input type="password" placeholder="Password" name="pass"
                       maxlength="32"> 
                <br>
                <input id="login-button" class="user-ops-button" type="submit"
                    name="submit" value="">
            </form>
            <h5 class="login-signup-message">
                Don't have an account? Go ahead and 
                <span id="signup-page-button" class="page-link">
                    sign up
                </span> -- it's free!
            </h5>
            <div class="page-links">
                •
                <span id="terms" class="page-link">
                    Terms of Service
                </span>
                •
                <br>
                •
                <span id="about" class="page-link">
                    About Chattest
                </span>
                •
                <br>
                •
                <span id="privacy" class="page-link">
                    Privacy Policy
                </span>
                •
            </div>
            <div id="main-footer" class="section-footer">
                Sign in
            </div>
        </div>
        <div id="signup-page-container" class="section-container">
            <div id="signup-page-info">
                <h1 class="header-main">
                    Chattest
                </h1>
                <h3>
                    Create your free account!
                </h3>

<?php
    //If the user has just submitted the form, check if form data is valid
    if ($check_sbm_s) {
        include "php/credentials.php";
        
        $usr_s = $_POST['username_s'];
        $pw1_s = $_POST['pass_s'];
        $pw2_s = $_POST['pass2_s'];

        $check_usr_s = !!$usr_s;
        $check_pw1_s = !!$pw1_s;
        $check_pw2_s = !!$pw2_s;
        $check_unl_s = (strlen($usr_s) > 5 && strlen($usr_s) < 15 ? true : false);
        $check_p1l_s = (strlen($pw1_s) > 7 && strlen($pw1_s) < 33 ? true : false);

        $check_forms_s = false; //Initializing other check variables
        $check_unq_s = false;

        if($check_pw1_s && $check_pw2_s) {
            $check_p12_s = $pw1_s == $pw2_s;
        }
        //First check if something obvious is wrong with the submitted form data
        if($check_usr_s && $check_pw1_s && $check_pw2_s && $check_p12_s && $check_unl_s && $check_p1l_s) {
            //Then perform more costly checks (i.e. username uniqueness in db)
            $check_forms_s = true;

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

            $stmt->execute(array($usr_s));
            $check_unq_s = ($stmt->rowCount() == 0 ? true : false);
        }
    }
    //Check whether the form was submitted, or if the form or database checks failed
    //If one of the checks fail, re-render the input forms...
    if (!$check_sbm_s || !$check_forms_s || !$check_unq_s) {
?>
                <form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">
                    <input type="text" placeholder="Username (6-14 chars)"
                           name="username_s" maxlength="14"
                           value="<?php echo isset($usr_s) ? $usr_s : "" ?>">
                    <input type="password" placeholder="Password (8-32 chars)"
                           name="pass_s" maxlength="32">
                    <input type="password" placeholder="Repeat Password"
                           name="pass2_s" maxlength="32">
                    <br>
                    <input id="signup-button" class="user-ops-button"
                        type="submit" name="submit_s" value="">
                </form>
                <div class="error-container">

<?php
    //... and give more specific information about problem with submitted form data
    if(!$check_sbm_s) {
        echo '<span class="initial-message">Choose a username and password!</span>' .
            LoginOps::highlightInput(0);
    } elseif (!$check_usr_s) {
        echo 'Please select a username.' . LoginOps::highlightInput(0);
    } elseif (!$check_pw1_s) {
        echo 'Please select a password.' . LoginOps::highlightInput(1);
    } elseif (!$check_pw2_s) {
        echo 'You must confirm your password.' . LoginOps::highlightInput(1);
    } elseif (!$check_unl_s) {
        echo 'Your username should be <strong>6-14 characters</strong> long.' .
            LoginOps::highlightInput(0);
    } elseif (!$check_p1l_s) {
        echo 'Your password should be <strong>8-32 characters</strong> long.' .
            LoginOps::highlightInput(1);
    } elseif (!$check_p12_s) {
        echo 'Your passwords did not match.' . LoginOps::highlightInput(1);
    } elseif (!$check_unq_s) {
        echo 'Sorry, the username <strong>' . $usr_s .
            '</strong> is already in use.' . LoginOps::highlightInput(0);
    }
?>

                </div>
                <div>
                    <span id="signup-page-back" class="page-link">
                        Back to Sign In
                    </span>
                </div>

<?php
    }

    //Otherwise, if the form data is valid and the username is unique
    //then add the new user's information into the database
    else {
        $pw1_s = password_hash($pw1_s, PASSWORD_BCRYPT);

        try {
            $stmt = $db->prepare("INSERT INTO all_users (name, pass) " .
                "VALUES (:name, :pass)");
            $stmt->execute(array(':name' => $usr_s, ':pass' => $pw1_s));
        }
        catch(PDOException $ex) {
            echo "There was a problem adding to the user database: " . $ex->getMessage();
        }
        //Then finally render a message alerting user that the account was
        //registered, i.e., without the input forms being re-rendered; this
        //is to reduce the risk of a user accidentally attempting to re-register
?>

                <script>
                    document.getElementsByTagName("input")[0].value = "<?php echo $usr_s?>";
                </script>
                <p>
                    Your username and password have been registered! You can now
                    <span id="signed-up-back" class="page-link">
                        log in.
                    </span>
                </p>

<?php
    }
?>

            </div>
            <div id="signup-footer" class="section-footer">
                Registration
            </div>
        </div>
        <div id="terms-container" class="section-container">
            <?php include "templates/terms-of-service.html" ?>
        </div>
        <div id="about-container" class="section-container">
            <?php include "templates/about-us.html"; ?>
        </div>
        <div id="privacy-container" class="section-container">
            <?php include "templates/privacy-policy.html"; ?>
        </div>
    </body>
</html>