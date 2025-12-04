<?php
// api/admin/get_users.php - Get all users
require_once '../../config.php';

// Check if user is logged in and is admin
if (!isLoggedIn() || $_SESSION['role'] !== 'admin') {
    sendJSON(['success' => false, 'message' => 'Unauthorized access'], 403);
}

// Connect to database
$conn = getDBConnection();
if (!$conn) {
    sendJSON(['success' => false, 'message' => 'Database connection failed'], 500);
}

// Get all users
$sql = "SELECT user_id, first_name, last_name, email, role, dob 
        FROM users 
        ORDER BY role, last_name, first_name";

$result = $conn->query($sql);

$users = [];
while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

$conn->close();

sendJSON([
    'success' => true,
    'users' => $users
]);
?>