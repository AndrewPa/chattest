<?php 
    mysql_connect("localhost", "chattest_logins") or die(mysql_error()); 
    mysql_select_db("chattest_users") or die(mysql_error());

    if (isset($_POST['submit'])) { 
        if (!$_POST['username']) {
            die('Please select a username.');
        } elseif (!$_POST['pass']) {
            die('Please select a password.');
        } elseif (!$_POST['pass2']) {
            die('Please confirm your password.');
        }

    if (!get_magic_quotes_gpc()) {
        $_POST['username'] = addslashes($_POST['username']);
    }

    $usercheck = $_POST['username'];
    $check = mysql_query("SELECT name FROM all_users WHERE name = '$usercheck'") 
        or die(mysql_error());
    $check2 = mysql_num_rows($check);

    if ($check2 != 0) {
        die('Sorry, the username '.$_POST['username'].' is already in use.');
    }
    if ($_POST['pass'] != $_POST['pass2']) {
        die('Your passwords did not match.');
    }

    $_POST['pass'] = md5($_POST['pass']);
        if (!get_magic_quotes_gpc()) {
            $_POST['pass'] = addslashes($_POST['pass']);
            $_POST['username'] = addslashes($_POST['username']);
        }

    $insert = "INSERT INTO users (name, pass)
        VALUES ('".$_POST['username']."', '".$_POST['pass']."')";
    mysql_query($insert) or die(mysql_error());
?>

<p>
    Your username and password have been registered. Please <a href="../index.php">log in</a> now.
</p>

<?php 
    }

    else {	
?>

<form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">
    <table border="0">
        <tr>
            <td>Username:</td>
            <td>
                <input type="text" name="username" maxlength="60">
            </td>
        </tr>
        <tr>
            <td>Password:</td>
            <td><input type="password" name="pass" maxlength="10"></td>
        </tr>
        <tr>
            <td>Confirm Password:</td>
            <td>
                <input type="password" name="pass2" maxlength="10">
            </td>
        </tr>
        <tr>
            <th colspan=2>
                    <input type="submit" name="submit" value="Register">
            </th>
        </tr>
    </table>
</form>

<?php
    }
?> 