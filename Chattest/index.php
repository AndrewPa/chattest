<?php
    session_start();
    ob_start();

    include "php/LoginOps.php";

    if(LoginOps::isLoggedIn()) {
        header("Location: php/chattest_app.php");
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
?>

<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charset="UTF-8">
        <title>Chattest - A Chat Room for Lonely Hearts</title>
        <meta name="keywords" content="">
        <meta name="description" content="">
        <link rel="stylesheet" type="text/css" href="css/chattest_user_ops.css" media="screen" />
    </head>
    <body>
        <div>
            <h1 id="header-main">Chattest</h1>
            <h2 id="header-sub">A Chat Room for Lonely Hearts</h2>
        </div>
        <form class="in-block" action="<?php echo $_SERVER['PHP_SELF']?>" method="post">
            <input type="text" placeholder="Username" name="username"
                   maxlength="14" value="<?php echo isset($usr) ? $usr : "" ?>">
            <input type="password" placeholder="Password" name="pass"
                   maxlength="32"> 
            <br>
            <input id="login-button" class="user-ops-button" type="submit"
                name="submit" value="">
        </form>

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
                    header("Location: php/chattest_app.php");
                    die();
                }
                else {
                    $check_cpd = false;
                }
            }
        }
    }
?>
        <div id="error-container">
<?php
        if(!$check_sbm) {
            echo '<span id="initial-message">Enter your username and password!<span>' .
                LoginOps::highlightInput(0);
        } elseif (!$check_usr) {
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
?>
        </div>
        <h5>Don't have an account? Go ahead and <a href="php/signup.php">sign up</a> -- it's free!</h5>
    </body>
</html>
