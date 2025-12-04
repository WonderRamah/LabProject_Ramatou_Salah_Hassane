<?php
// api/auth/login.php - Login handler
require_once '../../config.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJSON(['success' => false, 'message' => 'Invalid request method'], 405);
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!isset($input['email']) || !isset($input['password'])) {
    sendJSON(['success' => false, 'message' => 'Email and password are required']);
}

$email = trim($input['email']);
$password = $input['password'];

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendJSON(['success' => false, 'message' => 'Invalid email format']);
}

// Connect to database
$conn = getDBConnection();
if (!$conn) {
    sendJSON(['success' => false, 'message' => 'Database connection failed'], 500);
}

// Prepare statement to find user
$stmt = $conn->prepare("SELECT user_id, first_name, last_name, email, password_hash, role FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
    
    // Verify password
    if (password_verify($password, $user['password_hash'])) {
        // Password correct - create session
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['first_name'] = $user['first_name'];
        $_SESSION['last_name'] = $user['last_name'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['logged_in'] = true;
        
        sendJSON([
            'success' => true,
            'message' => 'Login successful!',
            'role' => $user['role'],
            'user' => [
                'id' => $user['user_id'],
                'firstName' => $user['first_name'],
                'lastName' => $user['last_name'],
                'email' => $user['email']
            ]
        ]);
    } else {
        sendJSON(['success' => false, 'message' => 'Invalid email or password']);
    }
} else {
    sendJSON(['success' => false, 'message' => 'Invalid email or password']);
}

$stmt->close();
$conn->close();
?>