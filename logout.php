<?php
// Start session
session_start();

// Set header to return JSON response
header('Content-Type: application/json');

// Initialize response array
$response = array();

try {
    // Unset all session variables
    $_SESSION = array();
    
    // Destroy the session cookie
    if (isset($_COOKIE[session_name()])) {
        setcookie(session_name(), '', time() - 3600, '/');
    }
    
    // Destroy the session
    session_destroy();
    
    // Success response
    $response['logout'] = true;
    $response['message'] = "You have been logged out successfully";
    
} catch (Exception $e) {
    // Error response
    $response['logout'] = false;
    $response['message'] = "Error logging out. Please try again.";
}

// Return JSON response
echo json_encode($response);
?>