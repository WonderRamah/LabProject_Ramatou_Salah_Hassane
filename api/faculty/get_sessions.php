<?php
// api/faculty/get_sessions.php - Get faculty's course sessions
require_once '../../config.php';

// Check if user is logged in and is faculty
if (!isLoggedIn() || $_SESSION['role'] !== 'faculty') {
    sendJSON(['success' => false, 'message' => 'Unauthorized access'], 403);
}

$facultyId = $_SESSION['user_id'];

// Connect to database
$conn = getDBConnection();
if (!$conn) {
    sendJSON(['success' => false, 'message' => 'Database connection failed'], 500);
}

// Get sessions for faculty's courses
$sql = "SELECT 
            s.session_id,
            s.topic,
            s.location,
            s.start_time,
            s.end_time,
            s.date,
            c.course_id,
            c.course_code,
            c.course_name
        FROM sessions s
        INNER JOIN courses c ON s.course_id = c.course_id
        WHERE c.faculty_id = ?
        ORDER BY s.date DESC, s.start_time DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $facultyId);
$stmt->execute();
$result = $stmt->get_result();

$sessions = [];
while ($row = $result->fetch_assoc()) {
    $sessions[] = $row;
}

$stmt->close();
$conn->close();

sendJSON([
    'success' => true,
    'sessions' => $sessions
]);
?>