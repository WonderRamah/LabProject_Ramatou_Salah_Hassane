<?php
// index.php - Entry point for the application

// Start session
session_start();

// Check if user is already logged in
if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
    // User is logged in - redirect to appropriate dashboard based on role
    if (isset($_SESSION['role'])) {
        if ($_SESSION['role'] === 'student') {
            header('Location: html/student_dashboard.php');
        } elseif ($_SESSION['role'] === 'faculty') {
            header('Location: html/faculty_dashboard.php');
        } else {
            // Unknown role - redirect to login
            header('Location: html/login.html');
        }
    } else {
        // No role set - redirect to login
        header('Location: html/login.html');
    }
} else {
    // User is not logged in - redirect to login page
    header('Location: html/login.html');
}

exit;
?>