<?php
// api/admin/get_overview.php - Get system overview statistics
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

$overview = [];

// Get total students
$result = $conn->query("SELECT COUNT(*) as count FROM students");
$overview['total_students'] = $result->fetch_assoc()['count'];

// Get total faculty
$result = $conn->query("SELECT COUNT(*) as count FROM faculty");
$overview['total_faculty'] = $result->fetch_assoc()['count'];

// Get total courses
$result = $conn->query("SELECT COUNT(*) as count FROM courses");
$overview['total_courses'] = $result->fetch_assoc()['count'];

// Get total sessions
$result = $conn->query("SELECT COUNT(*) as count FROM sessions");
$overview['total_sessions'] = $result->fetch_assoc()['count'];

$conn->close();

sendJSON([
    'success' => true,
    'overview' => $overview
]);
?>