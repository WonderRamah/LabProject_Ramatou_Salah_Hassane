<?php
// config.php - Database configuration
// Place this in your project root

// Database credentials - CHANGE THESE TO YOUR SERVER SETTINGS
define('DB_HOST', 'localhost');
define('DB_USER', 'ramatou.hassane');      // Change this
define('DB_PASS', 'H00pla%a');      // Change this
define('DB_NAME', 'attendance_db');      // Change this

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Database connection function
function getDBConnection() {
    try {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        
        if ($conn->connect_error) {
            throw new Exception("Connection failed: " . $conn->connect_error);
        }
        
        $conn->set_charset("utf8mb4");
        return $conn;
        
    } catch (Exception $e) {
        error_log("Database connection error: " . $e->getMessage());
        return null;
    }
}

// Helper function to send JSON response
function sendJSON($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

// Helper function to check if user is logged in
function isLoggedIn() {
    return isset($_SESSION['user_id']) && isset($_SESSION['role']);
}

// Helper function to check user role
function hasRole($role) {
    return isLoggedIn() && $_SESSION['role'] === $role;
}
?>