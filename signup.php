<?php
session_start();
header('Content-Type: application/json');

// Include database connection from root folder
require_once __DIR__ . '/../db_connection.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);
    
    if (isset($data['email']) && isset($data['password']) && 
        isset($data['first_name']) && isset($data['last_name']) && 
        isset($data['role'])) {
        
        $email = trim($data['email']);
        $password = $data['password'];
        $first_name = trim($data['first_name']);
        $last_name = trim($data['last_name']);
        $role = trim($data['role']);
        
        // Validation
        $errors = array();
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = "Invalid email format";
        }
        
        if (strlen($password) < 6) {
            $errors[] = "Password must be at least 6 characters";
        }
        
        if ($role !== 'student' && $role !== 'faculty') {
            $errors[] = "Invalid role selected";
        }
        
        if (!empty($errors)) {
            $response['success'] = false;
            $response['message'] = implode(", ", $errors);
            echo json_encode($response);
            exit;
        }
        
        // Check if email exists
        $check_email = $conn->prepare("SELECT user_id FROM users WHERE email = ?");
        $check_email->bind_param("s", $email);
        $check_email->execute();
        $check_email->store_result();
        
        if ($check_email->num_rows > 0) {
            $response['success'] = false;
            $response['message'] = "Email already exists";
            $check_email->close();
            echo json_encode($response);
            exit;
        }
        $check_email->close();
        
        // Hash password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        // Start transaction
        $conn->begin_transaction();
        
        try {
            // Insert user
            $stmt = $conn->prepare("INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("sssss", $first_name, $last_name, $email, $hashed_password, $role);
            
            if (!$stmt->execute()) {
                throw new Exception("Error inserting user");
            }
            
            $user_id = $conn->insert_id;
            $stmt->close();
            
            // Insert into role table
            if ($role === 'student') {
                $role_stmt = $conn->prepare("INSERT INTO students (student_id) VALUES (?)");
                $role_stmt->bind_param("i", $user_id);
                $role_stmt->execute();
                $role_stmt->close();
            } elseif ($role === 'faculty') {
                $role_stmt = $conn->prepare("INSERT INTO faculty (faculty_id) VALUES (?)");
                $role_stmt->bind_param("i", $user_id);
                $role_stmt->execute();
                $role_stmt->close();
            }
            
            $conn->commit();
            
            $response['success'] = true;
            $response['message'] = "Account created successfully!";
            
        } catch (Exception $e) {
            $conn->rollback();
            $response['success'] = false;
            $response['message'] = "Error creating account";
        }
        
    } else {
        $response['success'] = false;
        $response['message'] = "All fields are required";
    }
} else {
    $response['success'] = false;
    $response['message'] = "Invalid request method";
}

$conn->close();
echo json_encode($response);
?>