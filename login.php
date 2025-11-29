<?php
// Start session
session_start();

// Set header to return JSON response
header('Content-Type: application/json');

// Include database connection
require_once '../db_connection.php';

// Initialize response array
$response = array();

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Get JSON data from request body
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);
    
    // Validate that required fields are present
    if (isset($data['email']) && isset($data['password'])) {
        
        // Get and sanitize input data
        $email = trim($data['email']);
        $password = $data['password'];
        
        // Server-side validation
        if (empty($email) || empty($password)) {
            $response['success'] = false;
            $response['message'] = "Email and password are required";
            echo json_encode($response);
            exit;
        }
        
        // Validate email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $response['success'] = false;
            $response['message'] = "Invalid email format";
            echo json_encode($response);
            exit;
        }
        
        // Query database to find user by email
        $stmt = $conn->prepare("SELECT user_id, first_name, last_name, email, password_hash, role FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        // Check if user exists
        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            
            // Verify password
            if (password_verify($password, $user['password_hash'])) {
                // Password is correct - create session variables
                $_SESSION['user_id'] = $user['user_id'];
                $_SESSION['email'] = $user['email'];
                $_SESSION['first_name'] = $user['first_name'];
                $_SESSION['last_name'] = $user['last_name'];
                $_SESSION['role'] = $user['role'];
                $_SESSION['logged_in'] = true;
                
                // Success response
                $response['success'] = true;
                $response['message'] = "Login successful!";
                $response['user_id'] = $user['user_id'];
                $response['email'] = $user['email'];
                $response['first_name'] = $user['first_name'];
                $response['last_name'] = $user['last_name'];
                $response['role'] = $user['role'];
                
            } else {
                // Password is incorrect
                $response['success'] = false;
                $response['message'] = "Invalid email or password";
            }
            
        } else {
            // User not found
            $response['success'] = false;
            $response['message'] = "Invalid email or password";
        }
        
        $stmt->close();
        
    } else {
        // Missing required fields
        $response['success'] = false;
        $response['message'] = "Email and password are required";
    }
    
} else {
    // Not a POST request
    $response['success'] = false;
    $response['message'] = "Invalid request method";
}

// Close database connection
$conn->close();

// Return JSON response
echo json_encode($response);
?>