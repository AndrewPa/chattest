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
        <meta name="keywords" content="chatroom, chat, lonely, bored">
        <meta name="description" content="Chattest - A Chat Room for Lonely Hearts">
        <link rel="stylesheet" type="text/css" href="css/chattest_user_ops.css" media="screen" />
        <script type="text/javascript" src="js/libraries/jquery-1.10.2.js"></script>
        <script type="text/javascript" src="js/user_ops_main.js"></script>
    </head>
    <body>
        <h1 id="header-main">Chattest</h1>
        <div id="main-container">
            <h2 id="header-sub">A Chat Room for Lonely Hearts</h2>
            <div id="error-container">

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
        echo '<div id="initial-message">Enter your username and password!' .
            '</div>' . LoginOps::highlightInput(0);
    }
?>

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
            <h5 class="login-signup-message">
                Don't have an account? Go ahead and <a href="php/signup.php">
                    sign up</a> -- it's free!
            </h5>
            <div class="page-links">
                <span id="terms" class="page-link">
                    Terms of Service
                </span>
                •
                <span id="about" class="page-link">
                    About Chattest
                </span>
            </div>
            <div id="main-footer">
                Sign in
            </div>
        </div>
        <div id="terms-container">
            <div id="terms-info">
                <h3 id="terms-header">Chattest Terms of Service ("Agreement")</h3>
                    <p>This Agreement was last modified on April 17, 2014.</p>

                    <p>
                        Please read these Terms of Service ("Agreement", "Terms
                        of Service") carefully before using http://chattest.ca
                        ("the Site") operated by Chattest ("us", "we", or "our").
                        This Agreement sets forth the legally binding terms and
                        conditions for your use of the Site at http://chattest.ca.
                    </p>
                    <p>
                        By accessing or using the Site in any manner, including,
                        but not limited to, visiting or browsing the Site or
                        contributing content or other materials to the Site,
                        you agree to be bound by these Terms of Service.
                        Capitalized terms are defined in this Agreement.
                    </p>

                    <p>
                        <strong>Intellectual Property</strong><br>The Site and
                        its original content, features and functionality are
                        owned by Chattest and are protected by international
                        copyright, trademark, patent, trade secret and other
                        intellectual property or proprietary rights laws.
                    </p>

                    <p>
                        <strong>Termination</strong><br>We may terminate your
                        access to the Site, without cause or notice, which may
                        result in the forfeiture and destruction of all
                        information associated with you. All provisions of this
                        Agreement that by their nature should survive
                        termination shall survive termination, including,
                        without limitation, ownership provisions, warranty
                        disclaimers, indemnity, and limitations of liability.
                    </p>

                    <p>
                        <strong>Links To Other Sites</strong><br>Our Site may
                        contain links to third-party sites that are not owned
                        or controlled by Chattest.
                    </p>
                    <p>
                        Chattest has no control over, and assumes no
                        responsibility for, the content, privacy policies, or
                        practices of any third party sites or services. We
                        strongly advise you to read the terms and conditions
                        and privacy policy of any third-party site that you visit.
                    </p>

                    <p>
                        <strong>Governing Law</strong><br>This Agreement (and
                        any further rules, polices, or guidelines incorporated
                        by reference) shall be governed and construed in
                        accordance with the laws of Quebec, Canada, without
                        giving effect to any principles of conflicts of law.
                    </p>

                    <p>
                        <strong>Changes To This Agreement</strong><br>We reserve
                        the right, at our sole discretion, to modify or replace
                        these Terms of Service by posting the updated terms on
                        the Site. Your continued use of the Site after any such
                        changes constitutes your acceptance of the new Terms of
                        Service.
                    </p>
                    <p>
                        Please review this Agreement periodically for changes.
                        If you do not agree to any of this Agreement or any
                        changes to this Agreement, do not use, access or
                        continue to access the Site or discontinue any use of
                        the Site immediately.
                    </p>

                    <p>
                        <strong>Contact Us</strong><br>If you have any questions
                        about this Agreement, please contact us at
                        <a href="mailto:andy@chattest.ca">andy@chattest.ca</a>.
                    </p>

                    <p style="font-size: 85%; color: #999;">
                        Generated with permission from
                        <a href="http://termsfeed.com/terms-service/generator/" 
                           title="TermsFeed" style="color: #999; text-decoration:
                           none;">TermsFeed Generator</a>.
                    </p>
            </div>
            <div>
                <span id="terms-back" class="page-link">
                    Back to Sign In
                </span>
            </div>
            <div id="terms-footer">
                Terms of Service
            </div>
        </div>
        <div id="about-container">
            <div id="about-info">
                <h2 id="about-header">
                    Welcome to Chattest!
                </h2>
                <p>
                    Chattest is a rapidly-evolving free online chat service,
                    currently in its early stages. Our primary goal at Chattest
                    is to provide a place where people who are feeling a bit lonely
                    can come together and enjoy each others' online company for a
                    chat about whatever may be on their minds.
                </p>

                <p>
                    Chattest is currently an experimental service that will continue
                    to grow organically over time to better suit the needs of our
                    users. Feedback from users to the development team is highly
                    encouraged, as our goal is also to promote an online service
                    that strives to work with the user to create a better chat
                    experience together.
                </p>

                <p>
                    Chattest was created and is based in Canada, but is open to
                    English speakers from any part of the world. The site is
                    supported by minimal ad content, so registration and use
                    are both completely free.
                </p>

                <p>
                    If you have any thoughts or concerns about the site or would
                    just like to know more about Chattest, send an email to
                    <a href="mailto:andy@chattest.ca">andy@chattest.ca</a>.
                </p>
            </div>
            <div>
                <span id="about-back" class="page-link">
                    Back to Sign In
                </span>
            </div>
            <div id="about-footer">
                About Chattest
            </div>
        </div>
    </body>
</html>