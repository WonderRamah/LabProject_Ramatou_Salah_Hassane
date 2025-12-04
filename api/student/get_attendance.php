<?php
// api/student/get_attendance.php - Get student's attendance records
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

// Get attendance records with session and course details
$sql = "SELECT 
            a.attendance_id,
            a.status,
            a.check_in_time,
            a.remarks,
            s.session_id,
            s.date,
            s.topic,
            s.start_time,
            s.end_time,
            s.location,
            c.course_id,
            c.course_code,
            c.course_name
        FROM attendance a
        INNER JOIN sessions s ON a.session_id = s.session_id
        INNER JOIN courses c ON s.course_id = c.course_id
        WHERE a.student_id = ?
        ORDER BY s.date DESC, s.start_time DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $studentId);
$stmt->execute();
$result = $stmt->get_result();

$attendance = [];
while ($row = $result->fetch_assoc()) {
    $attendance[] = $row;
}

$stmt->close();
$conn->close();

sendJSON([
    'success' => true,
    'attendance' => $attendance
]);
?>