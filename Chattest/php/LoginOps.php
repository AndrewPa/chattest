<?php
    class LoginOps {
        static public function validateUser($userid) {
            session_regenerate_id ();
            $_SESSION['valid'] = 1;
            $_SESSION['userid'] = $userid;
        }
        static public function isLoggedIn() {
            if(isset($_SESSION['valid']) && $_SESSION['valid']) {
                return true;
            }
            return false;
        }
    }
?>