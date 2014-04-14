<?php
    class LoginOps {
        static public function validateUser($userid) {
            session_regenerate_id();
            $_SESSION['valid'] = 1;
            $_SESSION['userid'] = $userid;
        }
        static public function isLoggedIn() {
            if(isset($_SESSION['valid']) && $_SESSION['valid']) {
                return true;
            }
            return false;
        }
        //When echoed, this function adds a script that allows for more
        //convenient correction of signup errors
        static public function highlightInput($input_index) {
            //Input indexes: 0 is username, 1 is password, 2 is password confirmation
            return '<script>document.getElementsByTagName("input")[' .
                $input_index . '].select();</script>';
        } 
    }