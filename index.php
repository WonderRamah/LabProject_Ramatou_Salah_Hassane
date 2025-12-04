<?php
// index.php - Main entry point
require_once 'config.php';

// Check if user is logged in
if (isLoggedIn()) {
    // Redirect to appropriate dashboard based on role
    switch ($_SESSION['role']) {
        case 'student':
            header('Location: pages/student_dashboard.html');
            break;
        case 'faculty':
            header('Location: pages/faculty_dashboard.html');
            break;
        case 'admin':
            header('Location: pages/admin_dashboard.html');
            break;
        default:
            header('Location: pages/login.html');
    }
} else {
    // Not logged in - redirect to login page
    header('Location: pages/login.html');
}
exit;
?>