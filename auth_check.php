<?php
// auth_check.php - Include this file at the top of protected pages

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Check if user is logged in
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    // User is not logged in - redirect to login page
    header('Location: login.html');
    exit;
}

// Optional: Check if session has expired (e.g., after 1 hour of inactivity)
$timeout_duration = 3600; // 1 hour in seconds

if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity']) > $timeout_duration) {
    // Session has expired
    session_unset();
    session_destroy();
    header('Location: login.html?timeout=1');
    exit;
}

// Update last activity time
$_SESSION['last_activity'] = time();

// User is authenticated - script continues
?>