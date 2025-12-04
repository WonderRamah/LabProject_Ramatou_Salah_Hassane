<?php
// api/auth/check_session.php - Check if user is logged in
require_once '../../config.php';

if (isLoggedIn()) {
    sendJSON([
        'loggedIn' => true,
        'userId' => $_SESSION['user_id'],
        'firstName' => $_SESSION['first_name'],
        'lastName' => $_SESSION['last_name'],
        'email' => $_SESSION['email'],
        'role' => $_SESSION['role']
    ]);
} else {
    sendJSON([
        'loggedIn' => false,
        'message' => 'Not logged in'
    ]);
}
?>