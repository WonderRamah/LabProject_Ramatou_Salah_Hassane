<?php
// api/auth/signup.php - User registration handler
require_once '../../config.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJSON(['success' => false, 'message' => 'Invalid request method'], 405);
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate input
$required = ['firstName', 'lastName', 'email', 'password', 'role', 'dob'];
foreach ($required as $field) {
    if (!isset($input[$field]) || empty(trim($input[$field]))) {
        sendJSON(['success' => false, 'message' => 'All fields are required']);
    }
}

$firstName = trim($input['firstName']);
$lastName = trim($input['lastName']);
$email = trim($input['email']);
$password = $input['password'];
$role = trim($input['role']);
$dob = trim($input['dob']);

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendJSON(['success' => false, 'message' => 'Invalid email format']);
}

// Validate password length
if (strlen($password) < 6) {
    sendJSON(['success' => false, 'message' => 'Password must be at least 6 characters']);
}

// Validate role
$validRoles = ['student', 'faculty', 'admin'];
if (!in_array($role, $validRoles)) {
    sendJSON(['success' => false, 'message' => 'Invalid role selected']);
}

// Connect to database
$conn = getDBConnection();
if (!$conn) {
    sendJSON(['success' => false, 'message' => 'Database connection failed'], 500);
}

// Check if email already exists
$stmt = $conn->prepare("SELECT user_id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $stmt->close();
    $conn->close();
    sendJSON(['success' => false, 'message' => 'Email already exists']);
}
$stmt->close();

// Hash password
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

// Begin transaction
$conn->begin_transaction();

try {
    // Insert user
    $stmt = $conn->prepare("INSERT INTO users (first_name, last_name, email, password_hash, role, dob) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $firstName, $lastName, $email, $passwordHash, $role, $dob);
    
    if (!$stmt->execute()) {
        throw new Exception("Failed to create user");
    }
    
    $userId = $conn->insert_id;
    $stmt->close();
    
    // Insert into role-specific table
    if ($role === 'student') {
        $stmt = $conn->prepare("INSERT INTO students (student_id) VALUES (?)");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $stmt->close();
    } elseif ($role === 'faculty') {
        $stmt = $conn->prepare("INSERT INTO faculty (faculty_id) VALUES (?)");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $stmt->close();
    }
    
    // Commit transaction
    $conn->commit();
    
    sendJSON([
        'success' => true,
        'message' => 'Account created successfully! Redirecting to login...'
    ]);
    
} catch (Exception $e) {
    // Rollback on error
    $conn->rollback();
    sendJSON(['success' => false, 'message' => 'Failed to create account: ' . $e->getMessage()], 500);
}

$conn->close();
?>