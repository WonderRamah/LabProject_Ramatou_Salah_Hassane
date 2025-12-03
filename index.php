<?php
// index.php - Entry point for your Attendance Management System
session_start();

// Check if user is already logged in
if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
    // User is logged in - redirect to role selection or dashboard
    if (isset($_SESSION['role'])) {
        // Redirect to appropriate dashboard based on role
        switch ($_SESSION['role']) {
            case 'student':
                header('Location: html/student_dashboard.html');
                break;
            case 'faculty':
                header('Location: html/faculty_dashboard.html');
                break;
            case 'faculty_intern':
                header('Location: html/faculty_intern_dashboard.html');
                break;
            default:
                header('Location: html/role.html');
        }
    } else {
        header('Location: html/role.html');
    }
    exit;
}

// User is not logged in - redirect to login page
header('Location: html/login.html');
exit;
?>