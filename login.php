<?php
// php/login.php - User login handler
session_start();
header('Content-Type: application/json');

// Include database connection from root folder
require_once __DIR__ . '/../db_connection.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);
    
    if (isset($data['email']) && isset($data['password'])) {
        
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
                $_SESSION['last_activity'] = time();
                
                // Success response
                $response['success'] = true;
                $response['message'] = "Login successful!";
                $response['user'] = array(
                    'user_id' => $user['user_id'],
                    'email' => $user['email'],
                    'first_name' => $user['first_name'],
                    'last_name' => $user['last_name'],
                    'role' => $user['role']
                );
                
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
        $response['success'] = false;
        $response['message'] = "Email and password are required";
    }
    
} else {
    $response['success'] = false;
    $response['message'] = "Invalid request method";
}

$conn->close();
echo json_encode($response);
?>