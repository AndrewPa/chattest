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
            <input type="text" placeholder="Username" name="username" maxlength="30">
            <input type="password" placeholder="Password" name="pass" maxlength="30"> 
            <br><input id="login-button" class="user-ops-button" type="submit" name="submit" value="">
        </form>
        <h5>Don't have an account? Go ahead and <a href="php/signup.php">sign up</a>!</h5>
    </body>
</head>

<?php 
    }

    include "php/credentials.php";

    if (isset($_POST['submit'])) {
        $usr = $_POST['username'];
        $pwd = $_POST['pass'];

        if(!$usr) {
            die('Please enter your username.');
        }
        if(!$pwd) {
            die('Please enter your password.');
        }
        
        $db = new PDO('mysql:host=localhost;dbname=chattest_users;charset=utf8',
            $credentials["login"]["id"], $credentials["login"]["pass"]);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        
        try {
            $stmt = $db->prepare("SELECT * FROM all_users WHERE name = ?");
            $stmt->execute(array($usr));
        }
        catch(PDOException $ex) {
            echo "There was a problem accessing the user database: " . $ex->getMessage();
        }

        $check_usr = ($stmt->rowCount() > 0 ? true : false);

        if (!$check_usr) {
            die('Sorry, user <strong>' . $usr .
                '</strong> does not exist.');
        }
        
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            if (password_verify($pwd, $row['pass'])) {
                LoginOps::validateUser($_POST['username']);
                header("Location: php/chattest_app.php");
                die();

            }
            else {
                die('Incorrect password for user <strong>' .
                    $usr . '</strong>.');
            }
        }
    }
?>