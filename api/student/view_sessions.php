<?php
// api/student/view_sessions.php - Get upcoming sessions for student's courses
require_once '../../config.php';

// Check if user is logged in and is a student
if (!isLoggedIn() || $_SESSION['role'] !== 'student') {
    sendJSON(['success' => false, 'message' => 'Unauthorized access'], 403);
}

$studentId = $_SESSION['user_id'];

// Connect to database
$conn = getDBConnection();
if (!$conn) {
    sendJSON(['success' => false, 'message' => 'Database connection failed'], 500);
}

// Get upcoming sessions for courses the student is enrolled in
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
        INNER JOIN course_student_list csl ON c.course_id = csl.course_id
        WHERE csl.student_id = ? 
        AND s.date >= CURDATE()
        ORDER BY s.date ASC, s.start_time ASC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $studentId);
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